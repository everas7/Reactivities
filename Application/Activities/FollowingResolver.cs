using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
  public class FollowingResolver : IValueResolver<UserActivity, AttendeeDTO, bool>
  {
    private readonly DataContext _context;    
    private readonly IUserAccessor _userAccessor;
    public FollowingResolver(DataContext context, IUserAccessor userAccessor)
    {
      _context = context;
      _userAccessor = userAccessor;
    }

    public bool Resolve(UserActivity source, AttendeeDTO destination, bool destMember, ResolutionContext context)
    {
      var currentUser = _context.Users.SingleOrDefaultAsync(u => 
        u.UserName == _userAccessor.getCurrentUsername()).Result;

      if (currentUser.Followings.Any(f => f.TargetId == source.AppUserId))
        return true;

      return false;
    }
  }
}