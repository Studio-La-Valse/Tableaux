using System.Collections.ObjectModel;

namespace Tableaux.ViewModels.Base
{
    public abstract class PropertyCollectionViewModel : BaseViewModel
    {
        public abstract string Header { get; }

        public bool IsExpanded
        {
            get => GetValue(() => IsExpanded);
            set => SetValue(() => IsExpanded, value);
        }

        public ObservableCollection<PropertyViewModel> Properties
        {
            get => GetValue(() => Properties);
            set => SetValue(() => Properties, value);
        }

        public ObservableCollection<ActionViewModel> Actions
        {
            get => GetValue(() => Actions);
            set => SetValue(() => Actions, value);
        }

        public PropertyCollectionViewModel()
        {
            Properties = [];
            Actions = [];
            IsExpanded = true;
        }
    }
}
