using System.Collections.Generic;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using Tableaux.API.Native.Engine;
using Tableaux.API.Native.Utils;

namespace Tableaux.API.Native.Classic
{
    public class AnimatedRainbowBoxes : BaseContentWrapper
    {
        private readonly double canvasHeight;
        private readonly double canvasWidth;
        private readonly CircleOfFifths circleOfFifths;
        private readonly double minWidth = 10;
        private readonly double maxWidth = 100;
        private readonly double canvasTop = 0;


        public double BoxHeight => canvasHeight / 12;
        public double CanvasLeft => 0;

        public List<BaseDrawableElement> Boxes
        {
            get
            {
                var boxes = new List<BaseDrawableElement>();

                for (var i = 0; i < 12; i++)
                {
                    var topLeftY = canvasTop + BoxHeight * i;

                    var width = MathUtils.Map(circleOfFifths.Keys[i].Amplitude, 0, 1, minWidth, maxWidth);

                    var color = circleOfFifths.Keys[i].Color;

                    boxes.Add(new DrawableRectangle(CanvasLeft, topLeftY, width, BoxHeight, color: color));
                }

                return boxes;
            }
        }


        public AnimatedRainbowBoxes(CircleOfFifths circleOfFifths, double canvasHeight, double canvasWidth)
        {
            this.circleOfFifths = circleOfFifths;
            this.canvasHeight = canvasHeight;
            this.canvasWidth = canvasWidth;
        }

        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            return new List<BaseContentWrapper>();
        }

        public override IEnumerable<BaseDrawableElement> GetDrawableElements()
        {
            return Boxes;
        }
    }
}
