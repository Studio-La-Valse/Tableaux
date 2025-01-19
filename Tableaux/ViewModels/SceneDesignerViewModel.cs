using StudioLaValse.Drawable.Interaction.ViewModels;
using StudioLaValse.Drawable;
using System.Collections.Generic;
using Tableaux.API;
using System.Windows.Input;
using ReactiveUI;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Extensions;
using Tableaux.Models;
using System;

namespace Tableaux.ViewModels;
public class SceneDesignerViewModel
{
    private readonly ISceneDesigner sceneDesigner;
    private readonly CanvasViewModel canvasViewModel;
    private readonly INotifyEntityChanged<int> notifyEntityChanged;
    private readonly IAnimationService animationService;
    private IDisposable? subscription;

    public string Creator => sceneDesigner.Creator;
    public string Name => sceneDesigner.Name;
    public ICommand ActivateCommand { get; }

    public SceneDesignerViewModel(ISceneDesigner sceneDesigner, CanvasViewModel canvasViewModel, INotifyEntityChanged<int> notifyEntityChanged, IAnimationService animationService)
    {
        this.sceneDesigner = sceneDesigner;
        this.canvasViewModel = canvasViewModel;
        this.notifyEntityChanged = notifyEntityChanged;
        this.animationService = animationService;
        ActivateCommand = ReactiveCommand.Create(Activate);
    }

    public void Activate()
    {
        animationService.Stop();

        canvasViewModel.EnablePan = sceneDesigner.EnablePan;
        canvasViewModel.EnableZoom = sceneDesigner.EnableZoom;

        var wrapper = sceneDesigner.CreateScene();
        var sceneWrapper = new SceneWrapper(wrapper);
        var sceneManager = new SceneManager<int>(sceneWrapper, canvasViewModel.CanvasPainter);

        subscription?.Dispose();
        subscription = notifyEntityChanged.Subscribe(sceneManager.CreateObserver());

        sceneManager.Rerender();

        sceneDesigner.OnActivate();
    }

    class SceneWrapper : BaseVisualParent<int>
    {
        private readonly BaseContentWrapper wrapper;

        public SceneWrapper(BaseContentWrapper wrapper) : base(0)
        {
            this.wrapper = wrapper;
        }

        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            yield return wrapper;
        }
    }
}
