namespace Tableaux.API.Native.Streams
{
    public abstract class BaseInputStream : IDisposable
    {
        public abstract void Dispose();
        public abstract BaseState GetState();
    }
}
