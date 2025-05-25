using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;
using Tableaux.API.Native.Engine;

namespace Tableaux.API.Native.Classic
{
    public class ClassicAnimationContentWrapper : BaseContentWrapper
    {
        private readonly Klavier klavier;
        private readonly CircleOfFifths circleOfFifths;
        private readonly Queue<int> volumeHistory;



        private VisualCircleOfFifths CircleOfFifths =>
            new VisualCircleOfFifths(circleOfFifths, CanvasWidth / 2, CanvasHeight / 2);
        private AnimatedRainbowBoxes RainbowBoxes =>
            new AnimatedRainbowBoxes(circleOfFifths, CanvasHeight, CanvasWidth);
        private AnimatedKlavier Klavier =>
            new AnimatedKlavier(klavier, CanvasHeight, CanvasWidth);
        private AnimatedVolumeBoxes VolumeBoxes =>
            new AnimatedVolumeBoxes(circleOfFifths, CanvasWidth / 6, CanvasHeight / 2 + 50, volumeHistory, 50);
        private AnimatedSaturationBoxes SaturationBoxes =>
            new AnimatedSaturationBoxes(circleOfFifths, CanvasWidth / 4, CanvasHeight / 2 + 50);




        protected double CanvasWidth { get; }
        protected double CanvasHeight { get; }



        public ClassicAnimationContentWrapper(Klavier klavier, CircleOfFifths circleOfFifths, double canvasWidth, double canvasHeight, Queue<int> volumeHistory, double cofRadius)
        {
            this.klavier = klavier;
            this.circleOfFifths = circleOfFifths;
            this.volumeHistory = volumeHistory;

            CanvasHeight = canvasHeight;
            CanvasWidth = canvasWidth;

            circleOfFifths.Radius = cofRadius;
        }



        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            var elements = new List<BaseContentWrapper>()
            {
                CircleOfFifths, RainbowBoxes, Klavier, VolumeBoxes, SaturationBoxes
            };

            return elements;
        }

        public override IEnumerable<BaseDrawableElement> GetDrawableElements()
        {
            var color = circleOfFifths.KeyPointer.Color;

            color = new ColorAHSV(color.Hue, (int)(color.Saturation * 0.8), (int)(color.Value * 0.5));

            return
            [
                new DrawableRectangle(0, 0, CanvasWidth, CanvasHeight, color.ToColorARGB(), 0)
            ];
        }
    }
}
