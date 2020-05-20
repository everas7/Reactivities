using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
  public class List
  {
    public class Query : IRequest<List<ActivityDTO>> { };

    public class Handler : IRequestHandler<Query, List<ActivityDTO>>
    {
      private readonly DataContext _context;
      private readonly IMapper _iMapper;
      public Handler(DataContext context, IMapper iMapper)
      {
        _iMapper = iMapper;
        _context = context;
      }

      public async Task<List<ActivityDTO>> Handle(Query request,
          CancellationToken cancellationToken)
      {
        var activities = await _context.Activities
          .ToListAsync();
        return _iMapper.Map<List<Activity>, List<ActivityDTO>>(activities);
      }
    }
  }
}