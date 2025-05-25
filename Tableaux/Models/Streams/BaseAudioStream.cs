//using Tableaux.API.Signals;

//namespace Tableaux.Models.Streams
//{

//    public abstract class BaseAudioStream : BasePlaybackStream
//    {
//        private readonly IFastFourierTransformer fastFourier;


//        public abstract int SampleRate { get; }


//        public BaseAudioStream(IFastFourierTransformer fastFourierTransform)
//        {
//            fastFourier = fastFourierTransform;
//        }

//        public abstract IList<float> GetBuffer();

//        public sealed override BaseState GetState()
//        {
//            return new AudioStreamState(fastFourier, GetBuffer(), SampleRate);
//        }
//    }
//}
