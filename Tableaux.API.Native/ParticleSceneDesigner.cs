using StudioLaValse.Drawable.ContentWrappers;

namespace Tableaux.API.Native;

internal class ParticleSceneDesigner : ISceneDesigner
{
    private readonly ParticleScene particleScene;
    private readonly AnimationFrameInfo animationFrameInfo;
    private readonly IAnimationService animationService;

    public string Creator => "Native";
    public string Name => "Particles";
    public bool EnablePan => true;
    public bool EnableZoom => true;
    public BaseContentWrapper Scene => particleScene;
    public BaseContentWrapper HUD => animationFrameInfo;

    public ParticleSceneDesigner(ParticleScene particleScene, AnimationFrameInfo animationFrameInfo, IAnimationService animationService)
    {
        this.particleScene = particleScene;
        this.animationFrameInfo = animationFrameInfo;
        this.animationService = animationService;
    }

    private ICommandActivator? confettiActivator;
    private bool toggleActivator;

    public void RegisterSettings(ISettingsProvider settingsProvider)
    {
        settingsProvider.RegisterDouble(() => particleScene.Speed, (e) => { particleScene.Speed = e; }, "Particle Speed", 2);
        settingsProvider.RegisterInt(() => particleScene.SpawnCount, e => { particleScene.SpawnCount = e; }, "Spawn Count", 1);
        settingsProvider.RegisterInt(() => particleScene.MaxLife, e => { particleScene.MaxLife = e; }, "Lifetime", 100);
        settingsProvider.RegisterDouble(() => particleScene.Decay, e => { particleScene.Decay = e; }, "Decay", 0.5);

        confettiActivator = settingsProvider.RegisterCommand(() => particleScene.Add(1000), "Confetti");
        settingsProvider.RegisterCommand(() =>
        {
            confettiActivator?.SetEnabled(toggleActivator);
            toggleActivator = !toggleActivator;
        }, "Toggle Active");
    }

    public BaseContentWrapper OnUpdate(IMidiBuffer midi, AnimationFrame animationFrame)
    {
        particleScene.Update(animationFrame);
        animationFrameInfo.Update(animationFrame);

        return particleScene;
    }
}
