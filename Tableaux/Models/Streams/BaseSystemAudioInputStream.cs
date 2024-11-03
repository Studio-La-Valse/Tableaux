using Tableaux.Models.Signals;

namespace Tableaux.Models.Streams
{
    public abstract class BaseSystemAudioInputStream : BaseAudioStream
    {
        protected BaseSystemAudioInputStream(IFastFourierTransformer fastFourierTransform) : base(fastFourierTransform)
        {

        }
    }
}
