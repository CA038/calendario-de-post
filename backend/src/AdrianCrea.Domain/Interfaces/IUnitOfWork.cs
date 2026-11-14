namespace AdrianCrea.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IClientRepository Clients { get; }
    IContractRepository Contracts { get; }
    IPaymentRepository Payments { get; }
    ICalendarPostRepository CalendarPosts { get; }
    IRepository<Entities.CustomPlan> CustomPlans { get; }

    Task<int> CommitAsync(CancellationToken cancellationToken = default);
}
