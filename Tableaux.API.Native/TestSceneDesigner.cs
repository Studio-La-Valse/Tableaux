using StudioLaValse.Drawable;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Interaction;
using StudioLaValse.Drawable.Interaction.Extensions;
using StudioLaValse.Drawable.Interaction.UserInput;
using Tableaux.API.Native.Signals;
using Tableaux.API.Native.Streams;
using Tableaux.API.Native.Streams.Private;

namespace Tableaux.API.Native;

internal class TestSceneDesigner : ISceneDesigner
{
    private readonly IAnimationService animationService;
    private readonly TestScene scene;
    private BaseAudioStream? input;
    private readonly IFastFourierTransformer fastFourierTransformer;
    
    public string Creator => "Native";
    public string Name => "Test";
    public bool EnablePan => false;
    public bool EnableZoom => false;

    public TestSceneDesigner(IAnimationService animationService, TestScene scene)
    {
        this.animationService = animationService;
        this.scene = scene;

        fastFourierTransformer = new FastFourierSharpTransformer();
    }

    public BaseContentWrapper CreateScene()
    {
        return scene;
    }

    public void OnActivate()
    {
        input = new MicrophoneInputStream(0, 44_100, 32, 24, 16_384, fastFourierTransformer);
        input.StartStream();

        animationService.Start(16, Redraw);
    }

    public void OnDeactivate()
    {
        input?.StopStream();
        input?.Dispose();
    }

    public async Task Redraw(CancellationToken cancellationToken)
    {
        if(input is null)
        {
            return;
        }

        var state = input.GetState();
        var radius = state.CreateKlavier().Keys.Max(e => e.Loudness) * 500;
        scene.SetRadius(radius);

        await Task.CompletedTask;
    }

    public void RegisterSettings(ISettingsProvider settingsProvider)
    {
         
    }

    public IInputObserver Behavior(SceneManager<int> sceneManager, INotifyEntityChanged<int> notifyEntityChanged)
    {
        return new BaseInputObserver();
    }
}

internal class ParticleSceneDesigner : ISceneDesigner
{
    private readonly ParticleScene particleScene;
    private readonly IAnimationService animationService;

    public string Creator => "Native";
    public string Name => "Particles";
    public bool EnablePan => false;
    public bool EnableZoom => false;

    public ParticleSceneDesigner(ParticleScene particleScene, IAnimationService animationService)
    {
        this.particleScene = particleScene;
        this.animationService = animationService;
    }

    public BaseContentWrapper CreateScene()
    {
        return particleScene;
    }

    public void OnActivate()
    {
        animationService.Start(16, c =>
        {
            particleScene.Update();
            return Task.CompletedTask;
        });
    }

    public void OnDeactivate()
    {
        particleScene.Clear();    
    }

    
    public void RegisterSettings(ISettingsProvider settingsProvider)
    {
        
        settingsProvider.RegisterDouble(() => particleScene.Speed, (e) => { particleScene.Speed = e; }, "Testestest", 2);
    }

    public IInputObserver Behavior(SceneManager<int> sceneManager, INotifyEntityChanged<int> notifyEntityChanged)
    {
        return new BaseInputObserver().AddDefaultBehavior(sceneManager).AddRerender(notifyEntityChanged);
    }
}
