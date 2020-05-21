using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistance;
using Reactivities.Domain;

namespace Application.Photos
{
  public class Add
  {
    public class Command : IRequest<Photo>
    {
      public IFormFile file { get; set; }
    }

    public class Handler : IRequestHandler<Command, Photo>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;
      private readonly IPhotoAccessor _photoAccessor;
      public Handler(DataContext context, IUserAccessor userAccessor,
        IPhotoAccessor photoAccessor)
      {
        _photoAccessor = photoAccessor;
        _userAccessor = userAccessor;
        _context = context;
      }

      public async Task<Photo> Handle(Command request,
        CancellationToken cancellationToken)
      {
        var photoUpload = _photoAccessor.AddPhoto(request.file);

        var photo = new Photo
        {
          Id = photoUpload.PublicId,
          Url = photoUpload.Url,
        };

        var user = _context.Users.SingleOrDefault(u =>
          u.UserName == _userAccessor.getCurrentUsername());

        if (!user.Photos.Any(p => p.IsMain))
          photo.IsMain = true;

        user.Photos.Add(photo);

        // handler logic goes here
        var success = await _context.SaveChangesAsync() > 0;

        if (success) return photo;

        throw new Exception("There was a problem saving changes");
      }
    }
  }
}