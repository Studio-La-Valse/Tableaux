namespace Tableaux.API
{

    public interface ISettingsProvider
    {
        void RegisterString(Func<string> getValue, Action<string> setValue, string description, string @default);
        void RegisterDouble(Func<double> getValue, Action<double> setValue, string description, double @default);
        void RegisterInt(Func<int> getValue, Action<int> setValue, string description, int @default);
        ICommandActivator RegisterCommand(Action action, string description);
    }
}
