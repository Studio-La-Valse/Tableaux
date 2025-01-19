using StudioLaValse.Geometry;

namespace Tableaux.API.Native.Engine
{
    public class Chaser
    {
        private readonly CircleOfFifths circleOfFifths;
        private const double _damping = 50;


        public XY Position { get; private set; }
        public ColorAHSV Color { get; private set; }


        internal Chaser(CircleOfFifths circleOfFifths)
        {
            this.circleOfFifths = circleOfFifths;

            Position = new XY(0, 0);
            Color = new ColorAHSV(0, 0, 0, 0);
        }

        internal void Update(XY targetPosition, ColorAHSV targetColor)
        {
            Position += (targetPosition - Position) / _damping;

            Utils.HueSatFromPositionInCircle(Position, circleOfFifths.Radius, out var hue, out var sat);

            var currentBri = Color.Value;
            var deltaBri = targetColor.Value - currentBri;
            var newBri = currentBri + deltaBri / _damping;

            var currentAlpha = Color.Alpha;
            var deltaAlpha = targetColor.Alpha - currentAlpha;
            var newAlpha = currentAlpha + deltaAlpha / _damping;

            Color = new ColorAHSV(newAlpha, hue, sat, (int)newBri);
        }
    }
}
