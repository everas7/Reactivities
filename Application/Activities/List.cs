using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
  public class List
  {

    public class ActivityEnvelope
    {
      public List<ActivityDTO> Activities { get; set; }
      public int ActivityCount { get; set; }
    }
    public class Query : IRequest<ActivityEnvelope>
    {
      public Query(int? page, int? perPage,
        bool isGoing, bool isHost, DateTime? startDate)
      {
        Page = page;
        PerPage = perPage;
        IsGoing = isGoing;
        IsHost = isHost;
        StartDate = startDate ?? DateTime.Now;
      }
      public int? Page { get; set; }
      public int? PerPage { get; set; }
      public bool IsGoing { get; set; }
      public bool IsHost { get; set; }
      public DateTime? StartDate { get; set; }
    };

    public class Handler : IRequestHandler<Query, ActivityEnvelope>
    {
      private readonly DataContext _context;
      private readonly IMapper _iMapper;
      private readonly IUserAccessor _userAccessor;
      public Handler(DataContext context, IMapper iMapper, IUserAccessor userAccessor)
      {
        _userAccessor = userAccessor;
        _iMapper = iMapper;
        _context = context;
      }

      public async Task<ActivityEnvelope> Handle(Query request,
          CancellationToken cancellationToken)
      {
        var limit = request.PerPage ?? 3;
        var offset = (request.Page - 1 ?? 0) * limit;
        var queryable = _context.Activities
          .Where(a => a.Date >= request.StartDate)
          .OrderBy(a => a.Date)
          .AsQueryable();

        if (request.IsGoing && !request.IsHost)
        {
          queryable = queryable
            .Where(a => a.UserActivities.Any(ua =>
              ua.AppUser.UserName == _userAccessor.getCurrentUsername()));
        }

        if (!request.IsGoing && request.IsHost)
        {
          queryable = queryable
            .Where(a => a.UserActivities.Any(ua =>
              ua.AppUser.UserName == _userAccessor.getCurrentUsername() && ua.IsHost));
        }

        var activities = await queryable
          .Skip(offset)
          .Take(limit)
          .ToListAsync();

        return new ActivityEnvelope
        {
          Activities = _iMapper.Map<List<Activity>, List<ActivityDTO>>(activities),
          ActivityCount = queryable.Count(),
        };
      }
    }
  }
}