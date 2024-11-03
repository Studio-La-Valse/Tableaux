using StudioLaValse.Geometry;
using StudioLaValse.ScoreDocument.Core;
using System;
using Tableaux.Models.Utils;

namespace Tableaux.Models.Engine
{
    public class KeyInCircle
    {
        private readonly CircleOfFifths circleOfFifths;

        public double AngleStart { get; }
        public double AngleEnd { get; }
        public double AngleMiddle { get; }
        public ColorHSB Color { get; }
        public Step Step { get; }
        public double Amplitude { get; internal set; }


        public double Radius =>
            circleOfFifths.Radius;
        internal int IndexInCircle =>
            Step.PositionCircleOfFifths;
        public XY PositionInCircle =>
            CalculatePosition();
        public string MajorID =>
            Step.ToString();
        public string MinorID =>
            Step.RelativeMinor.ToString();


        internal KeyInCircle(Step step, CircleOfFifths fifths)
        {
            circleOfFifths = fifths;
            Step = step;

            var _24thCircle = Math.PI * 2 / 24;

            AngleMiddle = Math.PI * 2 / 12 * IndexInCircle;
            AngleStart = AngleMiddle - _24thCircle;
            AngleEnd = AngleMiddle + _24thCircle;

            AngleStart = MathUtils.ForcePositiveModulo(AngleStart, Math.PI * 2);
            AngleEnd = MathUtils.ForcePositiveModulo(AngleStart, Math.PI * 2);

            Color = Step.ToColorFifths();
        }

        private XY CalculatePosition()
        {
            var xPos = Radius * Math.Sin(AngleMiddle);
            var yPos = Radius * -Math.Cos(AngleMiddle);

            return new XY(xPos, yPos);
        }
    }
}
