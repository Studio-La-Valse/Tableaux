using Tableaux.Models.Signals;

namespace Tableaux.Models.Streams
{
    public abstract class BaseMicrophoneInputStream : BaseAudioStream
    {
        protected BaseMicrophoneInputStream(IFastFourierTransformer fastFourierTransform) : base(fastFourierTransform)
        {

        }
    }
}
