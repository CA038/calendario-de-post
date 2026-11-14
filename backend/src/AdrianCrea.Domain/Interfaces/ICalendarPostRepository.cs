using AdrianCrea.Domain.Entities;

namespace AdrianCrea.Domain.Interfaces;

public interface ICalendarPostRepository : IRepository<CalendarPost>
{
    Task<IEnumerable<CalendarPost>> GetByMonthAsync(int year, int month, CancellationToken cancellationToken = default);
    Task<IEnumerable<CalendarPost>> GetByClientIdAsync(long clientId, CancellationToken cancellationToken = default);
}
