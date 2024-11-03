namespace Tableaux.Models.Streams
{

    public abstract class BasePlaybackStream : BaseInputStream
    {
        public bool IsStreaming { get; private set; }

        public virtual void StartStream()
        {
            IsStreaming = true;
        }

        public virtual void StopStream()
        {
            IsStreaming = false;
        }
    }
}
