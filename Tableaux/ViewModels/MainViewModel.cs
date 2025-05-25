using StudioLaValse.Drawable.Interaction.ViewModels;
using Tableaux.ViewModels.Base;

namespace Tableaux.ViewModels;

public class MainViewModel : BaseViewModel
{
    public MainViewModel(SceneCanvasViewModel canvasViewModel, AddinCollectionViewModel addinCollectionViewModel, AddinPropertiesViewModel addinPropertiesViewModel, MidiConfigurationViewModel midiConfigurationViewModel)
    {
        CanvasViewModel = canvasViewModel;
        AddinCollectionViewModel = addinCollectionViewModel;
        AddinPropertiesViewModel = addinPropertiesViewModel;
        MidiConfigurationViewModel = midiConfigurationViewModel;
    }

    public SceneCanvasViewModel CanvasViewModel { get; }
    public AddinCollectionViewModel AddinCollectionViewModel { get; }
    public AddinPropertiesViewModel AddinPropertiesViewModel { get; }
    public MidiConfigurationViewModel MidiConfigurationViewModel { get; }
}
