namespace Tableaux.API
{
    public interface IAnimationService
    {
        bool Streaming { get; }
        void Start(int frameDuration, ISceneDesigner sceneDesigner);
        void Stop();
    }
}
