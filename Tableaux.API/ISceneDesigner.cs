using StudioLaValse.Drawable.ContentWrappers;

namespace Tableaux.API
{
    public interface ISceneDesigner
    {
        string Creator { get; }
        string Name { get; }
        bool EnablePan { get; }
        bool EnableZoom { get; }
        BaseContentWrapper CreateScene();
        void RegisterSettings(SettingsProvider settingsProvider);
        void OnActivate();
    }
}
