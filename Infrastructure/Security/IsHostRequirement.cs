using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistance;

namespace Infrastructure.Security
{
  public class IsHostRequirement : IAuthorizationRequirement
  {
  }

  public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
  {
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly DataContext _dataContext;
    public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor,
      DataContext dataContext)
    {
      _dataContext = dataContext;
      _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {

      var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(c 
        => c.Type == ClaimTypes.NameIdentifier)?.Value;

      var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(x =>
        x.Key == "id").Value.ToString());

      var activity = _dataContext.Activities.FindAsync(activityId).Result;

      var host = activity.UserActivities.FirstOrDefault(x => x.IsHost)?.AppUser;

      if (host?.UserName == currentUserName)
        context.Succeed(requirement);

      return Task.CompletedTask;
    }
  }
}