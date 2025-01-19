namespace Tableaux.API
{
    public interface IAnimationService
    {
        bool Streaming { get; }
        void Start(int frameDuration, Func<CancellationToken, Task> drawFrame);
        void Stop();
    }
}
