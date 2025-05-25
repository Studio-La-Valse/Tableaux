using StudioLaValse.Drawable;
using StudioLaValse.Drawable.ContentWrappers;

namespace Tableaux.API
{
    public interface ISceneDesigner
    {
        string Creator { get; }
        string Name { get; }
        bool EnablePan { get; }
        bool EnableZoom { get; }

        void RegisterSettings(ISettingsProvider settingsProvider);
        BaseContentWrapper OnUpdate(IMidiBuffer midiBuffer, AnimationFrame animationFrame);
    }
}
