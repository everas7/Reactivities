using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
  public class CurrentUser
  {
    public class Query : IRequest<User> { };

    public class Handler : IRequestHandler<Query, User>
    {
      private readonly UserManager<AppUser> _userManager;
      private readonly IJwtGenerator _jwtGenerator;
      private readonly IUserAccessor _userAcessor;

      public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator,
        IUserAccessor userAcessor)
      {
        _userAcessor = userAcessor;
        _jwtGenerator = jwtGenerator;
        _userManager = userManager;
      }

      public async Task<User> Handle(Query request,
          CancellationToken cancellationToken)
      {
        var user = await _userManager.FindByNameAsync(_userAcessor.getCurrentUsername());
        return new User
        {
          DisplayName = user.DisplayName,
          Username = user.UserName,
          Token = _jwtGenerator.CreateToken(user),
          Image = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
        };
      }
    }
  }
}