using StudioLaValse.Drawable;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Interaction;
using StudioLaValse.Drawable.Interaction.Extensions;
using StudioLaValse.Drawable.Interaction.UserInput;

namespace Tableaux.API.Native;

internal class ParticleSceneDesigner : ISceneDesigner
{
    private readonly ParticleScene particleScene;
    private readonly IAnimationService animationService;

    public string Creator => "Native";
    public string Name => "Particles";
    public bool EnablePan => true;
    public bool EnableZoom => true;
    public BaseContentWrapper Scene => particleScene;

    public ParticleSceneDesigner(ParticleScene particleScene, IAnimationService animationService)
    {
        this.particleScene = particleScene;
        this.animationService = animationService;
    }

    public void RegisterSettings(ISettingsProvider settingsProvider)
    {
        settingsProvider.RegisterDouble(() => particleScene.Speed, (e) => { particleScene.Speed = e; }, "Particle Speed", 2);
        settingsProvider.RegisterInt(() => particleScene.SpawnCount, e => { particleScene.SpawnCount = e; }, "Spawn Count", 1);
    }

    public void OnActivate()
    {

    }

    public async Task OnUpdate(AnimationFrame animationFrame, CancellationToken cancellationToken)
    {
        particleScene.Update(animationFrame);
        await Task.CompletedTask;
    }

    public void OnDeactivate()
    {
        particleScene.Clear();    
    }
}
