using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
  public class Details
  {
    public class Query : IRequest<ActivityDTO>
    {
      public Guid Id { get; set; }
    };

    public class Handler : IRequestHandler<Query, ActivityDTO>
    {
      private readonly DataContext _context;
      private readonly IMapper _iMapper;
      public Handler(DataContext context, IMapper iMapper)
      {
        _iMapper = iMapper;
        _context = context;
      }

      public async Task<ActivityDTO> Handle(Query request,
        CancellationToken cancellationToken)
      {
        var activity = await _context.Activities
          .FindAsync(request.Id);

        if (activity == null)
          throw new RestException(HttpStatusCode.NotFound, new { activity = "Not found" });

        return _iMapper.Map<Activity, ActivityDTO>(activity);
      }
    }
  }
}