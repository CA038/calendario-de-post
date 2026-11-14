using System.Linq.Expressions;
using AdrianCrea.Domain.Common;

namespace AdrianCrea.Domain.Interfaces;

public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(T entity, CancellationToken cancellationToken = default);
}

public interface IClientRepository : IRepository<Entities.Client>
{
    Task<Entities.Client?> GetWithDetailsAsync(long id, CancellationToken cancellationToken = default);
}

public interface IContractRepository : IRepository<Entities.Contract>
{
    Task<IReadOnlyList<Entities.Contract>> GetByClientIdAsync(long clientId, CancellationToken cancellationToken = default);
}

public interface IPaymentRepository : IRepository<Entities.Payment>
{
    Task<IReadOnlyList<Entities.Payment>> GetByMonthAndYearAsync(int month, int year, CancellationToken cancellationToken = default);
}
