using Tableaux.ViewModels.Base;

namespace Tableaux.ViewModels;

public class MainViewModel : BaseViewModel
{
    public MainViewModel(CanvasViewModel canvasViewModel)
    {
        CanvasViewModel = canvasViewModel;
    }

    public CanvasViewModel CanvasViewModel { get; }
}
