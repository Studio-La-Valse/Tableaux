using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;
using System.Collections.Generic;
using Tableaux.API.Native.Signals;
using Tableaux.API.Native.Utils;

namespace Tableaux.API.Native.Classic
{
    public class AnimatedSignal : BaseContentWrapper
    {
        private readonly double canvasLeft = 50;
        private readonly double canvasTop = 500;
        private readonly double canvasTopFFT = 600;
        private readonly double totalWidth = 200;
        private readonly double maxHeight = 50;
        private readonly int newSignalLength = 100;

        private readonly FFTSignal signal;
        private readonly double[] subSampledSignal;
        private readonly double[] subSampledFFT;


        public DrawablePolyline SignalPolyline
        {
            get
            {
                var points = new List<XY>();

                if (signal?.InputSignal is null)
                    return new DrawablePolyline(points, ColorARGB.White, 1);

                for (var i = 0; i < subSampledSignal.Length; i++)
                {
                    var x = MathUtils.Map(i, 0, subSampledSignal.Length, canvasLeft, canvasLeft + totalWidth);

                    var y = MathUtils.Map(subSampledSignal[i], 0, 1, canvasTop, canvasTop - maxHeight);

                    points.Add(new XY(x, y));
                }

                return new DrawablePolyline(points, ColorARGB.White, 1);
            }
        }
        public DrawablePolyline FFTPolyline
        {
            get
            {
                var points = new List<XY>();

                if (signal?.InputSignal is null)
                    return new DrawablePolyline(points, ColorARGB.White, 1);

                for (var i = 0; i < subSampledFFT.Length; i++)
                {
                    var x = MathUtils.Map(i, 0, subSampledFFT.Length, canvasLeft, canvasLeft + totalWidth);

                    var y = MathUtils.Map(subSampledFFT[i], 0, 1, canvasTopFFT, canvasTopFFT - maxHeight);

                    points.Add(new XY(x, y));
                }

                return new DrawablePolyline(points, ColorARGB.White, 1);
            }
        }
        public AnimatedSignal(FFTSignal signal, double canvasLeft, double canvasTop, double distanceBetweenGraphs, double totalWidth, double maxHeight, int subSampledLength)
        {
            this.signal = signal;
            this.canvasLeft = canvasLeft;
            this.canvasTop = canvasTop;
            this.canvasTopFFT = canvasTop + distanceBetweenGraphs;
            this.totalWidth = totalWidth;
            this.maxHeight = maxHeight;
            this.newSignalLength = subSampledLength;

            this.subSampledSignal = MathUtils.SubSampleValues(signal.InputSignal, newSignalLength);
            this.subSampledFFT = MathUtils.SubSampleValues(signal.Values, newSignalLength);
        }

        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            return new List<BaseContentWrapper>();
        }

        public override IEnumerable<BaseDrawableElement> GetDrawableElements()
        {
            return new List<BaseDrawableElement>()
            {
                SignalPolyline, FFTPolyline
            };
        }
    }
}
