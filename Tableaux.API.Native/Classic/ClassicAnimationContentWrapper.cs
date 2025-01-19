using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;
using System.Collections.Generic;
using Tableaux.API.Native.Streams;

namespace Tableaux.API.Native.Classic
{
    public class ClassicAnimationContentWrapper : BaseContentWrapper
    {
        private readonly State state;
        private readonly Queue<int> volumeHistory;



        private VisualCircleOfFifths CircleOfFifths =>
            new VisualCircleOfFifths(state.CircleOfFifths, CanvasWidth / 2, CanvasHeight / 2);
        private AnimatedRainbowBoxes RainbowBoxes =>
            new AnimatedRainbowBoxes(state.CircleOfFifths, CanvasHeight, CanvasWidth);
        private AnimatedKlavier Klavier =>
            new AnimatedKlavier(state.Klavier, CanvasHeight, CanvasWidth);
        private AnimatedVolumeBoxes VolumeBoxes =>
            new AnimatedVolumeBoxes(state.CircleOfFifths, CanvasWidth / 6, CanvasHeight / 2 + 50, volumeHistory, 50);
        private AnimatedSaturationBoxes SaturationBoxes =>
            new AnimatedSaturationBoxes(state.CircleOfFifths, CanvasWidth / 4, CanvasHeight / 2 + 50);
        private AnimatedSignal? Signal => state.FFTSignal is null ? null :
            new AnimatedSignal(state.FFTSignal, CanvasWidth * 0.7, CanvasHeight / 2 - 100, 100, CanvasWidth / 5, 80, 400);



        protected double CanvasWidth { get; }
        protected double CanvasHeight { get; }



        public ClassicAnimationContentWrapper(State state, double canvasWidth, double canvasHeight, Queue<int> volumeHistory, double cofRadius)
        {
            this.state = state;
            this.volumeHistory = volumeHistory;

            CanvasHeight = canvasHeight;
            CanvasWidth = canvasWidth;

            state.CircleOfFifths.Radius = cofRadius;
        }



        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            var elements = new List<BaseContentWrapper>()
            {
                CircleOfFifths, RainbowBoxes, Klavier, VolumeBoxes, SaturationBoxes
            };

            if (Signal != null)
            {
                elements.Add(Signal);
            }

            return elements;
        }

        public override IEnumerable<BaseDrawableElement> GetDrawableElements()
        {
            var color = state.CircleOfFifths.KeyPointer.Color;

            color = new ColorAHSV(color.Hue, (int)(color.Saturation * 0.8), (int)(color.Value * 0.5));

            return
            [
                new DrawableRectangle(0, 0, CanvasWidth, CanvasHeight, color.ToColorARGB(), 0)
            ];
        }
    }
}
