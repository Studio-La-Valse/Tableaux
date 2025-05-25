//using NAudio.Wave;
//using System;
//using System.Collections.Generic;
//using Tableaux.API.Signals;
//using Tableaux.Models.Streams;

//namespace Tableaux.Models.Streams.Private
//{
//    internal class AudioFileReaderInputSream : BaseAudioFilePlayerInputStream, IRenderStream
//    {
//        private readonly AudioFileReader _reader;
//        private readonly int _windowSize;
//        private double position;


//        public string FileSource { get; }


//        public override int SampleRate =>
//            _reader.WaveFormat.SampleRate;
//        public double ReaderPosition =>
//            _reader.Position;
//        public double ReaderLength =>
//            _reader.Length;




//        public AudioFileReaderInputSream(string fileName, IFastFourierTransformer fastFourierTransform, int windowSize = 16384) : base(fastFourierTransform)
//        {
//            FileSource = fileName;

//            _reader = new AudioFileReader(fileName);
//            _windowSize = windowSize;

//            Reset();
//        }



//        public override IList<float> GetBuffer()
//        {
//            var numberOfChannels = _reader.WaveFormat.Channels;

//            var buffer = new float[_windowSize * numberOfChannels];

//            _reader.Read(buffer, 0, buffer.Length);

//            for (var i = 0; i < buffer.Length; i += numberOfChannels)
//            {
//                var average = 0f;

//                for (var j = 0; j < numberOfChannels; j++)
//                {
//                    var indexInBuffer = i + j;

//                    average += buffer[indexInBuffer];
//                }

//                buffer[i] = average / numberOfChannels;
//            }

//            return buffer;
//        }
//        public bool MoveNext(int elapsedMs)
//        {
//            var bytesInWave = _reader.Length;

//            var bytesPerMS = bytesInWave / _reader.TotalTime.TotalMilliseconds;

//            _reader.Position = Convert.ToInt64(bytesPerMS * position);

//            position += elapsedMs;

//            if (position > _reader.TotalTime.TotalMilliseconds || _reader.Position > _reader.Length)
//            {
//                return false;
//            }

//            return true;
//        }
//        public void Reset()
//        {
//            position = 0;
//        }
//        public override void StartStream()
//        {
//            throw new NotImplementedException();
//        }
//        public override void StopStream()
//        {
//            throw new NotImplementedException();
//        }


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
