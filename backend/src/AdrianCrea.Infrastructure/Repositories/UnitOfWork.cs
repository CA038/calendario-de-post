using AdrianCrea.Domain.Entities;
using AdrianCrea.Domain.Interfaces;
using AdrianCrea.Infrastructure.Persistence;

namespace AdrianCrea.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AdrianCreaDbContext _context;

    public IClientRepository Clients { get; }
    public IContractRepository Contracts { get; }
    public IPaymentRepository Payments { get; }
    public ICalendarPostRepository CalendarPosts { get; }
    public IRepository<CustomPlan> CustomPlans { get; }

    public UnitOfWork(AdrianCreaDbContext context)
    {
        _context = context;
        Clients = new ClientRepository(context);
        Contracts = new ContractRepository(context);
        Payments = new PaymentRepository(context);
        CalendarPosts = new CalendarPostRepository(context);
        CustomPlans = new Repository<CustomPlan>(context);
    }

    public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}
