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
    public class AnimatedSaturationBoxes : BaseContentWrapper
    {
        private readonly CircleOfFifths circleOfFifths;
        private readonly int noBars = 8;
        private readonly double boxHeight = 40;
        private readonly double boxWidth = 10;
        private readonly double bri = 0.5;
        private readonly double canvasLeft;
        private readonly double canvasTopAtBottom;

        public double ChaserSaturation => circleOfFifths.Chaser.Color.Saturation;
        public double PointerHue => circleOfFifths.Pointer.Color.Hue;
        public double ChaserHue => circleOfFifths.Chaser.Color.Hue;
        public double KeyHue => circleOfFifths.Pointer.Color.Hue;


        public List<BaseDrawableElement> Boxes
        {
            get
            {
                var boxes = new List<BaseDrawableElement>();

                for (var i = 0; i < noBars; i++)
                {
                    var topLeftY = canvasTopAtBottom - (i + 1) * boxHeight;

                    var sat = MathUtils.Map(i, 0, noBars, 0.1, 1);

                    var deltaSat = Math.Abs(ChaserSaturation - sat);

                    var boxAlpha = MathUtils.Map(deltaSat, 0, 1, 1, 0.1);

                    var pColor = new ColorAHSB(boxAlpha, PointerHue, sat, bri);

                    var boxPoiner = new DrawableRectangle(canvasLeft, topLeftY, boxWidth, boxHeight, color: pColor);

                    var cColor = new ColorAHSB(boxAlpha, ChaserHue, sat, bri);

                    var boxChaser = new DrawableRectangle(canvasLeft + boxWidth, topLeftY, boxWidth, boxHeight, color: cColor);

                    var kColor = new ColorAHSB(boxAlpha, KeyHue, sat, bri);

                    var boxKey = new DrawableRectangle(canvasLeft + boxWidth * 2, topLeftY, boxWidth, boxHeight, color: kColor);

                    boxes.Add(boxPoiner);
                    boxes.Add(boxChaser);
                    boxes.Add(boxKey);
                }

                return boxes;
            }
        }
        public DrawablePolygon SaturationPointer
        {
            get
            {
                var y = MathUtils.Map(circleOfFifths.Pointer.Color.Saturation, 0, 1, canvasTopAtBottom - boxHeight / 2, canvasTopAtBottom - noBars * boxHeight + boxHeight / 2);

                var tip = new XY(canvasLeft, y);
                var topLeft = tip - new XY(10, 5);
                var bottomLeft = tip - new XY(10, -5);

                return new DrawablePolygon(new[] { tip, topLeft, bottomLeft }, ColorARGB.White);
            }
        }


        public AnimatedSaturationBoxes(CircleOfFifths circleOfFifths, double canvasLeft, double canvasTopAtBottom)
        {
            this.circleOfFifths = circleOfFifths;
            this.canvasLeft = canvasLeft;
            this.canvasTopAtBottom = canvasTopAtBottom;
        }

        public override IEnumerable<BaseDrawableElement> GetDrawableElements()
        {
            return Boxes.Append(SaturationPointer);
        }

        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            return [];
        }
    }
}
