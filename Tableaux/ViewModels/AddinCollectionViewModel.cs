using StudioLaValse.DependencyInjection;
using StudioLaValse.Drawable.Interaction.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tableaux.API;
using System.Collections.ObjectModel;
using DynamicData;
using StudioLaValse.Drawable.Extensions;
using StudioLaValse.Drawable;

namespace Tableaux.ViewModels;

public class AddinCollectionViewModel
{
    private readonly IAddinCollection<ISceneDesigner> sceneDesigners;
    private readonly CanvasViewModel canvasViewModel;
    private readonly INotifyEntityChanged<int> notifyEntityChanged;
    private readonly IAnimationService animationService;

    public ObservableCollection<SceneDesignerGroupViewModel> GroupedItems { get; } = [];

    public AddinCollectionViewModel(IAddinCollection<ISceneDesigner> sceneDesigners, CanvasViewModel canvasViewModel, INotifyEntityChanged<int> notifyEntityChanged, IAnimationService animationService)
    {
        this.sceneDesigners = sceneDesigners;
        this.canvasViewModel = canvasViewModel;
        this.notifyEntityChanged = notifyEntityChanged;
        this.animationService = animationService;
        BuildTree();
    }

    private void BuildTree()
    {
        GroupedItems.Clear();
        foreach (var item in this.sceneDesigners.GroupBy(x => x.Creator))
        {
            var group = new SceneDesignerGroupViewModel(item.Key);
            foreach(var scene in item)
            {
                var sceneViewModel = new SceneDesignerViewModel(scene, canvasViewModel, notifyEntityChanged, animationService);
                group.Items.Add(sceneViewModel);
            }
            GroupedItems.Add(group);
        }
    }
}
