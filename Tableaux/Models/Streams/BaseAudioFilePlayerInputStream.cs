using Tableaux.Models.Signals;

namespace Tableaux.Models.Streams
{
    public abstract class BaseAudioFilePlayerInputStream : BaseAudioStream
    {
        protected BaseAudioFilePlayerInputStream(IFastFourierTransformer fastFourierTransform) : base(fastFourierTransform)
        {

        }
    }
}
