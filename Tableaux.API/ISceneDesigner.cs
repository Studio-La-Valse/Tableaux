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
        BaseContentWrapper CreateScene();
        IInputObserver Behavior(SceneManager<int> sceneManager, INotifyEntityChanged<int> notifyEntityChanged);
        void RegisterSettings(SettingsProvider settingsProvider);
        void OnActivate();
        void OnDeactivate();
    }
}
