using AdrianCrea.Application.Interfaces;
using AdrianCrea.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace AdrianCrea.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IClientService, ClientService>();
        services.AddScoped<IContractService, ContractService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<ICalendarPostService, CalendarPostService>();

        return services;
    }
}
