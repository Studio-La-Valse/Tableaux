using StudioLaValse.Drawable.Interaction.ViewModels;
using Tableaux.ViewModels.Base;

namespace Tableaux.ViewModels;

public class MainViewModel : BaseViewModel
{
    public MainViewModel(CanvasViewModel canvasViewModel, AddinCollectionViewModel addinCollectionViewModel)
    {
        CanvasViewModel = canvasViewModel;
        AddinCollectionViewModel = addinCollectionViewModel;
    }

    public CanvasViewModel CanvasViewModel { get; }
    public AddinCollectionViewModel AddinCollectionViewModel { get; }
}
