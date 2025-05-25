//using NAudio.Wave;
//using System;
//using System.Collections.Generic;
//using System.IO;
//using Tableaux.API.Signals;

//namespace Tableaux.Models.Streams.Private
//{
//    internal class AudioFilePlayerInputSream : BaseAudioFilePlayerInputStream
//    {
//        private readonly IWavePlayer _playbackDevice;
//        private readonly SampleAggregator _aggregator;
//        private readonly AudioFileReader _fileReader;





//        public override int SampleRate =>
//            _aggregator.WaveFormat.SampleRate;



//        public AudioFilePlayerInputSream(string fileName, IFastFourierTransformer fastFourier, int bufferSize = 16384) : base(fastFourier)
//        {
//            if (!File.Exists(fileName))
//            {
//                throw new Exception($"File {fileName} does not exist!");
//            }

//            _fileReader = new AudioFileReader(fileName);

//            _aggregator = new SampleAggregator(_fileReader, bufferSize);

//            _playbackDevice = new WasapiOut();

//            _playbackDevice.Init(_aggregator);
//        }



//        public override void StartStream()
//        {
//            base.StartStream();

//            _playbackDevice.Play();
//        }

//        public override void StopStream()
//        {
//            base.StopStream();

//            _playbackDevice.Stop();

//            _fileReader.Position = 0;

//            _aggregator.Clean();
//        }

//        public override IList<float> GetBuffer() =>
//            _aggregator.GetBuffer();


//        private bool disposedValue;
//        protected virtual void Dispose(bool disposing)
//        {
//            if (!disposedValue)
//            {
//                if (disposing)
//                {
//                    StopStream();

//                    // TODO: dispose managed state (managed objects)
//                }

//                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
//                // TODO: set large fields to null
//                disposedValue = true;
//            }
//        }

//        // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
//        // ~SystemAudioInputStream()
//        // {
//        //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
//        //     Dispose(disposing: false);
//        // }

//        public override void Dispose()
//        {
//            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
//            Dispose(disposing: true);
//            GC.SuppressFinalize(this);
//        }

//    }
//}
