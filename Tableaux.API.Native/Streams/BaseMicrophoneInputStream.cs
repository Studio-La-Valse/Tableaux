using Tableaux.API.Native.Signals;

namespace Tableaux.API.Native.Streams
{
    public abstract class BaseMicrophoneInputStream : BaseAudioStream
    {
        protected BaseMicrophoneInputStream(IFastFourierTransformer fastFourierTransform) : base(fastFourierTransform)
        {

        }
    }
}
