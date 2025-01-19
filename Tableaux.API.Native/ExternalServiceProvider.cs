namespace Tableaux.API.Native;

using Microsoft.Extensions.DependencyInjection;
using StudioLaValse.DependencyInjection;

internal class ExternalServiceProvider : IExternalServiceProvider<IServiceCollection>
{
    public void AddTo(IServiceCollection container)
    {
        container.AddSingleton<TestScene>();
    }
}
