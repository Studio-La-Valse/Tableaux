namespace Tableaux.API
{
    public interface ISynchronizationContextService 
    { 
        Task PostAsync(Func<Task> action); 
    }
}
