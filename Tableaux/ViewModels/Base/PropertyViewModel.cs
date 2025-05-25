using Avalonia.Media;
using ReactiveUI;
using System;
using System.Windows.Input;

namespace Tableaux.ViewModels.Base
{

    public abstract class PropertyViewModel : BaseViewModel
    {
        public string Description
        {
            get => GetValue(() => Description);
            set => SetValue(() => Description, value);
        }

        public PropertyViewModel(string description)
        {
            Description = description;
        }
    }

    public class PropertyViewModel<TProperty> : PropertyViewModel
    {
        private readonly Action<TProperty> setValue;
        private readonly Func<TProperty> getValue;

        public TProperty Value
        {
            get => getValue();
            set
            {
                setValue(value);
                NotifyPropertyChanged(nameof(Value));
            }
        }

        public ICommand Restore { get; }

        public PropertyViewModel(Func<TProperty> getValue, Action<TProperty> setValue, string description, TProperty @default) : base(description)
        {
            this.setValue = setValue;
            this.getValue = getValue;

            Restore = ReactiveCommand.Create(() => this.Value = @default);
        }
    }

    public class PropertyViewModelDouble : PropertyViewModel<double>
    {
        public PropertyViewModelDouble(Func<double> getValue, Action<double> setValue, string description, double @default) : base(getValue, setValue, description, @default)
        {

        }
    }

    public class PropertyViewModelInt : PropertyViewModel<int>
    {
        public PropertyViewModelInt(Func<int> getValue, Action<int> setValue, string description, int @default) : base(getValue, setValue, description, @default)
        {

        }
    }

    public class PropertyViewModelString : PropertyViewModel<string>
    {
        public PropertyViewModelString(Func<string> getValue, Action<string> setValue, string description, string @default) : base(getValue, setValue, description, @default)
        {

        }
    }


    public class PropertyViewModelColor : PropertyViewModel<Color>
    {
        public PropertyViewModelColor(Func<Color> getValue, Action<Color> setValue, string description, Color @default) : base(getValue, setValue, description, @default)
        {

        }
    }
}
