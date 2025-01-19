using Tableaux.API.Native.Signals;

namespace Tableaux.API.Native.Streams
{
    public abstract class BaseAudioFilePlayerInputStream : BaseAudioStream
    {
        protected BaseAudioFilePlayerInputStream(IFastFourierTransformer fastFourierTransform) : base(fastFourierTransform)
        {

        }
    }
}
