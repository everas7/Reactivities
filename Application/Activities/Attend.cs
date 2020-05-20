using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistance;

namespace Application.Activities
{
  public class Attend
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;
      public Handler(DataContext context, IUserAccessor userAccessor)
      {
        _userAccessor = userAccessor;
        _context = context;
      }

      public async Task<Unit> Handle(Command request,
        CancellationToken cancellationToken)
      {
        var activity = _context.Activities.Find(request.Id);
        if (activity == null)
          throw new RestException(HttpStatusCode.NotFound,
          new { Activity = "Activity could not be found" });

        var user = _context.Users.FirstOrDefault(u =>
          u.UserName == _userAccessor.getCurrentUsername());

        var attendance = _context.UserActivities.FirstOrDefault(ua => 
          ua.ActivityId == activity.Id && ua.AppUserId == user.Id);
        
        if (attendance != null)
          throw new RestException(HttpStatusCode.BadRequest,
            new { Attendace = "The user is already attending this activity"});
        
        attendance = new UserActivity
        {
          AppUser = user,
          Activity = activity,
          IsHost = false,
          DateJoined = DateTime.Now,
        };

        _context.UserActivities.Add(attendance);

        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("There was a problem saving changes");
      }
    }
  }
}