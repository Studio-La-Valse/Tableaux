using StudioLaValse.DependencyInjection;
using System.Collections.Generic;
using System.Linq;
using Tableaux.API;
using System.Collections.ObjectModel;
using StudioLaValse.Drawable;
using StudioLaValse.Drawable.ContentWrappers;
using System.Windows.Input;
using ReactiveUI;

namespace Tableaux.ViewModels;

public class AddinCollectionViewModel
{
    private readonly IAddinCollection<ISceneDesigner> sceneDesigners;
    private readonly SceneCanvasViewModel canvasViewModel;
    private readonly AddinPropertiesViewModel addinPropertiesViewModel;
    private readonly IAnimationService animationService;
    private readonly ISettingsProvider settingsProvider;

    public ObservableCollection<SceneDesignerGroupViewModel> GroupedItems { get; } = [];

    public ICommand DeactivateCommand { get; }

    public AddinCollectionViewModel(IAddinCollection<ISceneDesigner> sceneDesigners, SceneCanvasViewModel canvasViewModel, AddinPropertiesViewModel addinPropertiesViewModel, INotifyEntityChanged<int> notifyEntityChanged, IAnimationService animationService, ISettingsProvider settingsProvider)
    {
        this.sceneDesigners = sceneDesigners;
        this.canvasViewModel = canvasViewModel;
        this.addinPropertiesViewModel = addinPropertiesViewModel;
        this.animationService = animationService;
        this.settingsProvider = settingsProvider;

        DeactivateCommand = ReactiveCommand.Create(Deactivate);

        BuildTree();
    }

    private void BuildTree()
    {
        GroupedItems.Clear();
        foreach (var item in this.sceneDesigners.GroupBy(x => x.Creator))
        {
            var group = new SceneDesignerGroupViewModel(item.Key);
            foreach (var scene in item)
            {
                var sceneViewModel = new SceneDesignerViewModel(scene, this);
                group.Items.Add(sceneViewModel);
            }
            GroupedItems.Add(group);
        }
    }

    public void Activate(ISceneDesigner sceneDesigner)
    {
        Deactivate();

        canvasViewModel.EnablePan = sceneDesigner.EnablePan;
        canvasViewModel.EnableZoom = sceneDesigner.EnableZoom;

        addinPropertiesViewModel.Clear();
        sceneDesigner.RegisterSettings(settingsProvider);

        animationService.Start(16, sceneDesigner);
    }

    public void Deactivate()
    {
        addinPropertiesViewModel?.Clear();
        animationService.Stop();
        canvasViewModel.CanvasPainter.FinishDrawing();
    }
}
