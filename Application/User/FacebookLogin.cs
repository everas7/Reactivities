using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.User
{
  public class FacebookLogin
  {
    public class Query : IRequest<User>
    {
      public string AccessToken { get; set; }
    };

    public class Handler : IRequestHandler<Query, User>
    {
      private readonly UserManager<AppUser> _userManager;
      private readonly IFacebookAccessor _facebookAccessor;
      private readonly IJwtGenerator _jwtGenerator;

      public Handler(UserManager<AppUser> userManager,
      IFacebookAccessor facebookAccessor, IJwtGenerator jwtGenerator)
      {
        _jwtGenerator = jwtGenerator;
        _facebookAccessor = facebookAccessor;
        _userManager = userManager;
      }

      public async Task<User> Handle(Query request, CancellationToken cancellationToken)
      {
        var userInfo = await _facebookAccessor.FacebookLogin(request.AccessToken);
        if (userInfo == null)
          throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem validating token" });

        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Email == userInfo.Email);

        if (user == null)
        {
          user = new AppUser
          {
            DisplayName = userInfo.Name,
            Email = userInfo.Email,
            Id = userInfo.Id,
            UserName = "fb_" + userInfo.Id,
          };

          var photo = new Photo
          {
            Id = "fb_img_" + userInfo.Id,
            Url = userInfo.Picture.Data.Url,
            IsMain = true,
          };

          user.Photos.Add(photo);
          var result = await _userManager.CreateAsync(user);

          if (!result.Succeeded)
            throw new Exception("Problem creating user");
        }

        return new User
        {
          DisplayName = user.DisplayName,
          Token = _jwtGenerator.CreateToken(user),
          Username = user.UserName,
          Image = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
        };
      }
    }
  }
}