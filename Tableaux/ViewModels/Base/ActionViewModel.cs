using ReactiveUI;
using System.Reactive;
using System.Windows.Input;

namespace Tableaux.ViewModels.Base
{
    public class ActionViewModel : BaseViewModel
    {
        public string Description
        {
            get => GetValue(() => Description);
            set => SetValue(() => Description, value);
        }

        public ReactiveCommand<Unit, Unit> Command
        {
            get => GetValue(() => Command);
            set => SetValue(() => Command, value);
        }

        public ActionViewModel(string description, ReactiveCommand<Unit, Unit> command)
        {
            Description = description;

            Command = command;
        }
    }
}
