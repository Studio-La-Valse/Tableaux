using System.Collections.ObjectModel;

namespace Tableaux.ViewModels;

public class SceneDesignerGroupViewModel
{
    public string Creator { get; set; }
    public ObservableCollection<SceneDesignerViewModel> Items { get; set; } = [];

    public SceneDesignerGroupViewModel(string creator)
    {
        Creator = creator;
    }
}
