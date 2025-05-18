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
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Interaction.UserInput;
using StudioLaValse.Drawable.Interaction.Extensions;

namespace Tableaux.ViewModels;

public class AddinCollectionViewModel
{
    private readonly IAddinCollection<ISceneDesigner> sceneDesigners;
    private readonly CanvasViewModel canvasViewModel;
    private readonly INotifyEntityChanged<int> notifyEntityChanged;
    private readonly IAnimationService animationService;
    private ISceneDesigner? activeSceneDesigner;
    private IDisposable? animationSubscription;

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
                var sceneViewModel = new SceneDesignerViewModel(scene, this);
                group.Items.Add(sceneViewModel);
            }
            GroupedItems.Add(group);
        }
    }

    public void Activate(ISceneDesigner sceneDesigner)
    {
        Deactivate();

        activeSceneDesigner = sceneDesigner;

        canvasViewModel.EnablePan = activeSceneDesigner.EnablePan;
        canvasViewModel.EnableZoom = activeSceneDesigner.EnableZoom;

        var sceneWrapper = new SceneWrapper(activeSceneDesigner);
        var sceneManager = new SceneManager<int>(sceneWrapper, canvasViewModel.CanvasPainter);

        canvasViewModel.InputObserver = sceneDesigner.Behavior(sceneManager, notifyEntityChanged);

        animationSubscription = notifyEntityChanged.Subscribe(sceneManager.CreateObserver());

        sceneManager.Rerender();

        sceneDesigner.OnActivate();
    }

    public void Deactivate()
    {
        activeSceneDesigner?.OnDeactivate();
        animationSubscription?.Dispose();
        animationService.Stop();
    }


    class SceneWrapper : BaseVisualParent<int>
    {
        private readonly ISceneDesigner sceneDesigner;

        public SceneWrapper(ISceneDesigner sceneDesigner) : base(0)
        {
            this.sceneDesigner = sceneDesigner;
        }

        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            var scene = sceneDesigner.CreateScene();
            yield return scene;
        }
    }
}
