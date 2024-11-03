using StudioLaValse.Geometry;

namespace Tableaux.Models.Engine
{
    public class Chaser
    {
        private readonly CircleOfFifths circleOfFifths;
        private const double _damping = 50;


        public XY Position { get; private set; }
        public ColorAHSB Color { get; private set; }


        internal Chaser(CircleOfFifths circleOfFifths)
        {
            this.circleOfFifths = circleOfFifths;

            Position = new XY(0, 0);
            Color = new ColorAHSB(0, 0, 0, 0);
        }

        internal void Update(XY targetPosition, ColorAHSB targetColor)
        {
            Position += (targetPosition - Position) / _damping;

            Utils.HueSatFromPositionInCircle(Position, circleOfFifths.Radius, out var hue, out var sat);

            var currentBri = Color.Brightness;
            var deltaBri = targetColor.Brightness - currentBri;
            var newBri = currentBri + deltaBri / _damping;

            var currentAlpha = Color.Alpha;
            var deltaAlpha = targetColor.Alpha - currentAlpha;
            var newAlpha = currentAlpha + deltaAlpha / _damping;

            Color = new ColorAHSB(newAlpha, hue, sat, newBri);
        }
    }
}
