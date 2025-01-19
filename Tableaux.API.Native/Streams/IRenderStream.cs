namespace Tableaux.API.Native.Streams
{
    public interface IRenderStream
    {
        string FileSource { get; }
        double ReaderPosition { get; }
        double ReaderLength { get; }
        void Reset();
        bool MoveNext();
        BaseState GetState();
    }
}
