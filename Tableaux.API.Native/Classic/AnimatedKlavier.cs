using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;
using System.Collections.Generic;
using Tableaux.API.Native.Engine;
using Tableaux.API.Native.Utils;

namespace Tableaux.API.Native.Classic
{
    public class AnimatedKlavier : BaseContentWrapper
    {
        private readonly Klavier klavier;
        private readonly double canvasHeight;
        private readonly double canvasWidth;

        public double HeightOnCanvas => canvasHeight * 0.92;
        public double CanvasLeft { get; } = 80;
        public double CanvasRight => canvasWidth - CanvasLeft;

        public List<BaseDrawableElement> KeyLines
        {
            get
            {
                var lines = new List<BaseDrawableElement>();

                for (var i = 0; i < 88; i++)
                {
                    var xpos = MathUtils.Map(i, 0, 87, CanvasLeft, CanvasRight);

                    var barHeight = MathUtils.Map(klavier.Keys[i].Loudness, 0, 1, 2, 100d);

                    lines.Add(new DrawableLineVertical(xpos, HeightOnCanvas, barHeight * -1, 5, ColorARGB.White));
                }

                return lines;
            }
        }
        public AnimatedKlavier(Klavier klavier, double canvasHeight, double canvasWidth)
        {
            this.klavier = klavier;
            this.canvasHeight = canvasHeight;
            this.canvasWidth = canvasWidth;
        }

        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            return [];
        }

        public override IEnumerable<BaseDrawableElement> GetDrawableElements()
        {
            return KeyLines;
        }
    }
}
