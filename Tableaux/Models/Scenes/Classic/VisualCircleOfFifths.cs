using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Drawable.Text;
using StudioLaValse.Geometry;
using System;
using System.Collections.Generic;
using System.Linq;
using Tableaux.Models.Engine;
using Tableaux.Models.Utils;

namespace Tableaux.Models.Scenes.Classic
{
    public class VisualCircleOfFifths : BaseContentWrapper
    {
        private readonly CircleOfFifths circleOfFifths;
        private readonly double canvasLeft;
        private readonly double canvasTop;
        private readonly double ringOffset = 30;


        private double MainRadius => circleOfFifths.Radius;
        public XY Transformation => new XY(canvasLeft, canvasTop);

        public List<BaseDrawableElement> InnerRing
        {
            get
            {
                var rings = new List<BaseDrawableElement>();

                var color = new ColorAHSB(0.1, circleOfFifths.Chaser.Color);

                var number = 5;

                for (var i = 1; i <= number; i++)
                {
                    var radius = MathUtils.Map(i, 0, number, 0, MainRadius + ringOffset * 3);

                    rings.Add(new DrawableCircle(canvasLeft, canvasTop, radius, color));
                }

                return rings;
            }
        }
        public BaseDrawableElement GlowRing
        {
            get
            {
                var _color = new ColorAHSB(0.3, circleOfFifths.KeyPointer.Color);

                var maxAmplitude = circleOfFifths.Keys
                    .Select(key => key.Amplitude)
                    .OrderByDescending(amp => amp)
                    .First();

                var strokeWeight = maxAmplitude * 100;

                return new DrawableCircle(Transformation, MainRadius + ringOffset + strokeWeight / 2, new ColorARGB(0, 0, 0, 0), _color, strokeWeight);
            }
        }
        public List<BaseDrawableElement> KeyInformation
        {
            get
            {
                var elements = new List<BaseDrawableElement>();

                foreach (var keyInfo in circleOfFifths.Keys)
                {
                    var keyIDPosition = keyInfo.PositionInCircle + Transformation;

                    var keyCircleRadius = MathUtils.Map(keyInfo.Amplitude, 0, 1, 0, 15);

                    elements.Add(new DrawableCircle(keyIDPosition, keyCircleRadius, keyInfo.Color, new ColorARGB(255, 255, 255, 255), 1));

                    var res = 8;

                    var keySegmentPoints = new List<XY>();

                    var angleStart = keyInfo.AngleStart;

                    var stepSize = Math.PI * 2 / 12 / (res - 1);

                    for (var j = 0; j < res; j++)
                    {
                        var rainbowRingRadius = MainRadius + ringOffset;

                        var xpos = rainbowRingRadius * Math.Sin(angleStart);
                        var ypos = rainbowRingRadius * -Math.Cos(angleStart);

                        keySegmentPoints.Add(new XY(xpos, ypos) + Transformation);

                        angleStart += stepSize;
                    }

                    var polyLineThickness = MathUtils.Map(keyInfo.Amplitude, 0, 1, 3, 50);

                    var keySegment = new DrawablePolyline(keySegmentPoints, keyInfo.Color, polyLineThickness);

                    elements.Add(keySegment);

                    var keyTextRadius = MainRadius + ringOffset * 2;

                    var keyTextPoxX = keyTextRadius * Math.Sin(keyInfo.AngleMiddle) + canvasLeft;
                    var keyTextPosY = keyTextRadius * -Math.Cos(keyInfo.AngleMiddle) + canvasTop;

                    elements.Add(new DrawableText(keyTextPoxX, keyTextPosY, keyInfo.MinorID, 10, ColorARGB.White, HorizontalTextOrigin.Center, VerticalTextOrigin.Center, new FontFamilyCore("Arial")));

                    keyTextRadius += ringOffset;

                    keyTextPoxX = keyTextRadius * Math.Sin(keyInfo.AngleMiddle) + canvasLeft;
                    keyTextPosY = keyTextRadius * -Math.Cos(keyInfo.AngleMiddle) + canvasTop;

                    elements.Add(new DrawableText(keyTextPoxX, keyTextPosY, keyInfo.MajorID, 14, color: ColorARGB.White, HorizontalTextOrigin.Center, VerticalTextOrigin.Center, new FontFamilyCore("Arial")));

                    var lineColor = new ColorARGB((int)Math.Round(keyInfo.Amplitude * 255), ColorRGB.White);
                    elements.Add(new DrawableLine(keyIDPosition, circleOfFifths.Pointer.Position + Transformation, lineColor, keyInfo.Amplitude));
                }

                return elements;
            }
        }
        public List<BaseDrawableElement> Pointers
        {
            get
            {
                var white = new ColorARGB(255, 255, 255, 255);
                var transparant = new ColorARGB(0, 255, 255, 255);

                var pointer = new DrawableCircle(circleOfFifths.Pointer.Position + Transformation, 5, transparant, white, 1);

                var chaserInner = new DrawableCircle(circleOfFifths.Chaser.Position + Transformation, 5, white);

                var chaserOuter = new DrawableCircle(circleOfFifths.Chaser.Position + Transformation, 10, transparant, white, 1);

                var keyPointer = new DrawableCircle(circleOfFifths.KeyPointer.InteralPosition + Transformation, 5, transparant, white, 1);

                var keyPointerX1 = MainRadius * Math.Sin(circleOfFifths.KeyPointer.Angle);
                var keyPointerY1 = MainRadius * -Math.Cos(circleOfFifths.KeyPointer.Angle);

                var keyPointerXY1 = new XY(keyPointerX1, keyPointerY1) + Transformation;

                var triangleWidth = 0.02;
                var triangleHeight = 10;

                var keyPointerX2 = (MainRadius - triangleHeight) * Math.Sin(circleOfFifths.KeyPointer.Angle - triangleWidth);
                var keyPointerY2 = (MainRadius - triangleHeight) * -Math.Cos(circleOfFifths.KeyPointer.Angle - triangleWidth);

                var keyPointerXY2 = new XY(keyPointerX2, keyPointerY2) + Transformation;

                var keyPointerX3 = (MainRadius - triangleHeight) * Math.Sin(circleOfFifths.KeyPointer.Angle + triangleWidth);
                var keyPointerY3 = (MainRadius - triangleHeight) * -Math.Cos(circleOfFifths.KeyPointer.Angle + triangleWidth);

                var keyPointerXY3 = new XY(keyPointerX3, keyPointerY3) + Transformation;

                var keyTriangle = new DrawablePolygon([keyPointerXY1, keyPointerXY2, keyPointerXY3], white);

                var maxAmplitude = circleOfFifths.Keys
                    .Select(key => key.Amplitude)
                    .OrderByDescending(amp => amp)
                    .First();

                var keyLine = new DrawableLine(Transformation, keyPointerXY1, white, maxAmplitude);

                return new List<BaseDrawableElement>()
                {
                    pointer,chaserInner, chaserOuter, keyPointer, keyTriangle, keyLine
                };
            }
        }
        public BaseDrawableElement ChordTriangle
        {
            get
            {
                var threeLoudest = circleOfFifths.Keys
                    .OrderByDescending(key => key.Amplitude)
                    .Take(3)
                    .Select(key => key.PositionInCircle + Transformation)
                    .ToList();

                var maxAmplitude = circleOfFifths.Keys
                    .Select(key => key.Amplitude)
                    .OrderByDescending(amp => amp)
                    .First();

                var color = new ColorARGB((int)Math.Ceiling(maxAmplitude * 255), ColorRGB.White);

                return new DrawablePolygon(threeLoudest, ColorARGB.Transparant, color, 1);
            }
        }


        public VisualCircleOfFifths(CircleOfFifths circleOfFifths, double canvasLeft, double canvasTop)
        {
            this.circleOfFifths = circleOfFifths;
            this.canvasLeft = canvasLeft;
            this.canvasTop = canvasTop;
        }



        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            return new List<BaseContentWrapper>();
        }

        public override IEnumerable<BaseDrawableElement> GetDrawableElements()
        {
            var elements = new List<BaseDrawableElement>();

            elements.AddRange(InnerRing);

            elements.Add(GlowRing);

            elements.AddRange(KeyInformation);

            elements.AddRange(Pointers);

            elements.Add(ChordTriangle);

            return elements;
        }
    }
}
