using System;
using System.Threading;
using System.Threading.Tasks;
using Tableaux.API;

namespace Tableaux.Models;
public class SynchronizationContextService : ISynchronizationContextService
{
    private readonly SynchronizationContext syncContext;

    public SynchronizationContextService()
    {
        this.syncContext = SynchronizationContext.Current ?? new SynchronizationContext();
    }

    public Task PostAsync(Func<Task> action)
    {
        var tcs = new TaskCompletionSource<bool>();

        syncContext.Post(async _ =>
        {
            try
            {
                await action();
                tcs.SetResult(true);
            }
            catch (Exception ex)
            {
                tcs.SetException(ex);
            }
        }, null);

        return tcs.Task;
    }

    public void Post(Action action)
    {
        syncContext.Send(_ => action(), null);
    }
}
