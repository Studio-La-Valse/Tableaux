using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;
using System;
using System.Collections.Generic;
using System.Linq;
using Tableaux.Models.Engine;
using Tableaux.Models.Utils;

namespace Tableaux.Models.Scenes.Classic
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

                ColorHSB fromBarIndex(int index)
                {
                    return index > maxNumberOfBars / 1.2 ?
                        new ColorHSB(0, 1, 0.5) :
                        new ColorHSB(cHUE, MathUtils.Map(index, 0, maxNumberOfBars, 0, 1), MathUtils.Map(index, 0, maxNumberOfBars, 1d / 2, 0.5));
                }

                for (var i = 0; i <= numberOfBars; i++)
                {
                    var color = fromBarIndex(i);

                    var ypos = canvasTopAtBottom - i * distanceBetweeenBars;

                    lines.Add(new DrawableLineHorizontal(ypos, canvasLeft, 30, 3, color));
                }

                if (maxAlpHist > numberOfBars)
                {
                    var _color = fromBarIndex(maxAlpHist);

                    var ypos = canvasTopAtBottom - maxAlpHist * distanceBetweeenBars;

                    lines.Add(new DrawableLineHorizontal(ypos, canvasLeft, 30, 3, _color));
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
