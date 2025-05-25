using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;
using Tableaux.API.Native.Engine;
using Tableaux.API.Native.Utils;

namespace Tableaux.API.Native.Classic
{
    public class AnimatedVolumeBoxes : BaseContentWrapper
    {
        private readonly CircleOfFifths circleOfFifths;
        private readonly double maxNumberOfBars = 20;
        private readonly double maxHeight = 40 * 8;
        private readonly double canvasLeft;
        private readonly double canvasTopAtBottom;
        private readonly Queue<int> history;
        private readonly int historyLength;

        public List<BaseDrawableElement> VolumeLines
        {
            get
            {
                var lines = new List<BaseDrawableElement>();

                var distanceBetweeenBars = maxHeight / maxNumberOfBars;

                var numberOfBars = (int)Math.Round(
                    Math.Min(maxNumberOfBars,
                        MathUtils.Map(
                            Math.Pow(circleOfFifths.Pointer.Color.Alpha, 1 / 2.0),
                            0, 0.9, 0, maxNumberOfBars)));

                history.Enqueue(numberOfBars);

                var maxAlpHist = history.Max();

                var cHUE = circleOfFifths.Pointer.Color.Hue;

                ColorAHSV fromBarIndex(int index)
                {
                    return index > maxNumberOfBars / 1.2 ?
                        new ColorAHSV(0, 100, 100) :
                        new ColorAHSV(cHUE, (int)MathUtils.Map(index, 0, maxNumberOfBars, 50, 100), (int)MathUtils.Map(index, 0, maxNumberOfBars, 1d / 2, 50));
                }

                for (var i = 0; i <= numberOfBars; i++)
                {
                    var color = fromBarIndex(i);

                    var ypos = canvasTopAtBottom - i * distanceBetweeenBars;

                    lines.Add(new DrawableLineHorizontal(ypos, canvasLeft, 30, 3, color.ToColorARGB()));
                }

                if (maxAlpHist > numberOfBars)
                {
                    var _color = fromBarIndex(maxAlpHist);

                    var ypos = canvasTopAtBottom - maxAlpHist * distanceBetweeenBars;

                    lines.Add(new DrawableLineHorizontal(ypos, canvasLeft, 30, 3, _color.ToColorARGB()));
                }

                while (history.Count > historyLength)
                {
                    history.Dequeue();
                }

                return lines;
            }
        }

        public AnimatedVolumeBoxes(CircleOfFifths circleOfFifths, double canvasLeft, double canvasTopAtBottom, Queue<int> history, int historyLength)
        {
            this.circleOfFifths = circleOfFifths;
            this.canvasLeft = canvasLeft;
            this.canvasTopAtBottom = canvasTopAtBottom;
            this.history = history;
            this.historyLength = historyLength;
        }

        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            return [];
        }

        public override IEnumerable<BaseDrawableElement> GetDrawableElements()
        {
            return VolumeLines;
        }
    }
}
