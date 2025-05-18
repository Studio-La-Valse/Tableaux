using StudioLaValse.Drawable.Interaction.ViewModels;
using Tableaux.ViewModels.Base;

namespace Tableaux.ViewModels;

public class MainViewModel : BaseViewModel
{
    public MainViewModel(CanvasViewModel canvasViewModel, AddinCollectionViewModel addinCollectionViewModel, AddinPropertiesViewModel addinPropertiesViewModel)
    {
        CanvasViewModel = canvasViewModel;
        AddinCollectionViewModel = addinCollectionViewModel;
        AddinPropertiesViewModel = addinPropertiesViewModel;
    }

    public CanvasViewModel CanvasViewModel { get; }
    public AddinCollectionViewModel AddinCollectionViewModel { get; }
    public AddinPropertiesViewModel AddinPropertiesViewModel { get; }
}
