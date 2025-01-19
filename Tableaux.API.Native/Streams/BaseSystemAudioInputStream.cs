using Tableaux.API.Native.Signals;

namespace Tableaux.API.Native.Streams
{
    public abstract class BaseSystemAudioInputStream : BaseAudioStream
    {
        protected BaseSystemAudioInputStream(IFastFourierTransformer fastFourierTransform) : base(fastFourierTransform)
        {

        }
    }
}
