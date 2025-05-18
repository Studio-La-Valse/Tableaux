using StudioLaValse.Drawable;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Interaction;

namespace Tableaux.API
{
    public interface ISceneDesigner
    {
        string Creator { get; }
        string Name { get; }
        bool EnablePan { get; }
        bool EnableZoom { get; }
        BaseContentWrapper Scene { get; }

        void RegisterSettings(ISettingsProvider settingsProvider);
        void OnActivate();
        Task OnUpdate(AnimationFrame animationFrame, CancellationToken cancellationToken);
        void OnDeactivate();
    }
}
