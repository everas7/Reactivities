using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Persistance;

namespace Application.Activities
{
  public class Edit
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
      public string Title { get; set; }
      public string Description { get; set; }
      public string Category { get; set; }
      public DateTime? Date { get; set; }
      public string City { get; set; }
      public string Venue { get; set; }
    }
    
    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x).Must(x => !string.IsNullOrEmpty(x.Title)
        || !string.IsNullOrEmpty(x.Description)
        || !string.IsNullOrEmpty(x.Category)
        || !string.IsNullOrEmpty(x.Date.ToString())
        || !string.IsNullOrEmpty(x.City)
        || !string.IsNullOrEmpty(x.Venue)
        ).WithName("Activity").WithMessage("You must provide at least one property to update");

      }
    }
    
    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }
    
      public async Task<Unit> Handle(Command request,
        CancellationToken cancellationToken)
      {
        var activity = await _context.Activities.FindAsync(request.Id);
        if (activity == null)
          throw new Exception("Could not find activity");

        activity.Title = request.Title ?? activity.Title;
        activity.Description = request.Description ?? activity.Description;
        activity.Category = request.Category ?? activity.Category;
        activity.Date = request.Date ?? activity.Date;
        activity.City = request.City ?? activity.City;
        activity.Venue = request.Venue ?? activity.Venue;

        var success = await _context.SaveChangesAsync() > 0;
    
        if (success) return Unit.Value;
    
        throw new Exception("There was a problem saving changes");
      }
    }
  }
}