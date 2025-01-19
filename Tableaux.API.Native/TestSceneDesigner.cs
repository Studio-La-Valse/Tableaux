using StudioLaValse.Drawable;
using StudioLaValse.Drawable.ContentWrappers;

namespace Tableaux.API.Native;

internal class TestSceneDesigner : ISceneDesigner
{
    private readonly IAnimationService animationService;
    private readonly INotifyEntityChanged<int> notifyEntityChanged;
    private readonly TestScene scene;

    public string Creator => "Native";
    public string Name => "Test";
    public bool EnablePan => false;
    public bool EnableZoom => false;

    public TestSceneDesigner(IAnimationService animationService, INotifyEntityChanged<int> notifyEntityChanged, TestScene scene)
    {
        this.animationService = animationService;
        this.notifyEntityChanged = notifyEntityChanged;
        this.scene = scene;
    }

    public BaseContentWrapper CreateScene()
    {
        return scene;
    }

    public void OnActivate()
    {
        animationService.Start(16, Redraw);
    }

    public async Task Redraw(CancellationToken cancellationToken)
    {
        scene.Rotate();
        notifyEntityChanged.Invalidate(1);
        await Task.CompletedTask;
    }

    public void RegisterSettings(SettingsProvider settingsProvider)
    {
         
    }
}
