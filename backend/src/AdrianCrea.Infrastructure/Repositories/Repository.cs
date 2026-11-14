using System.Linq.Expressions;
using AdrianCrea.Domain.Common;
using AdrianCrea.Domain.Entities;
using AdrianCrea.Domain.Interfaces;
using AdrianCrea.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AdrianCrea.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly AdrianCreaDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(AdrianCreaDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking().Where(predicate).ToListAsync(cancellationToken);
    }

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        return entity;
    }

    public Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        _context.Entry(entity).State = EntityState.Modified;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        return Task.CompletedTask;
    }
}

public class ClientRepository : Repository<Client>, IClientRepository
{
    public ClientRepository(AdrianCreaDbContext context) : base(context)
    {
    }

    public async Task<Client?> GetWithDetailsAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(c => c.Contracts)
            .Include(c => c.Payments)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }
}

public class ContractRepository : Repository<Contract>, IContractRepository
{
    public ContractRepository(AdrianCreaDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<Contract>> GetByClientIdAsync(long clientId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.ClientId == clientId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}

public class PaymentRepository : Repository<Payment>, IPaymentRepository
{
    public PaymentRepository(AdrianCreaDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<Payment>> GetByMonthAndYearAsync(int month, int year, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.Month == month && p.Year == year)
            .OrderByDescending(p => p.PaidDate)
            .ToListAsync(cancellationToken);
    }
}

public class CalendarPostRepository : Repository<CalendarPost>, ICalendarPostRepository
{
    public CalendarPostRepository(AdrianCreaDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<CalendarPost>> GetByMonthAsync(int year, int month, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(p => p.ScheduledDate.Year == year && p.ScheduledDate.Month == month)
            .OrderBy(p => p.ScheduledDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CalendarPost>> GetByClientIdAsync(long clientId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(p => p.ClientId == clientId)
            .OrderBy(p => p.ScheduledDate)
            .ToListAsync(cancellationToken);
    }
}
