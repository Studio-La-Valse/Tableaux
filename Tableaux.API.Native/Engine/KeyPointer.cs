using StudioLaValse.Geometry;
using StudioLaValse.ScoreDocument.Core;
using Tableaux.API.Native.Utils;

namespace Tableaux.API.Native.Engine
{
    public class KeyPointer
    {
        private readonly CircleOfFifths circleOfFifths;

        private const double drag = 200;
        private readonly int[] _keyMultiplier = { 4, 3, 1, 1, 2, 1, 1 };
        private readonly int[] KeyIndices;

        public XY InteralPosition { get; private set; }
        //math atan2 (X, -Y) because up is down
        public double Angle => Math.Atan2(InteralPosition.X, InteralPosition.Y * -1);


        internal double[] Amplitudes { get; private set; }
        public ColorAHSV Color { get; private set; }


        internal KeyPointer(CircleOfFifths circleOfFifths)
        {
            this.circleOfFifths = circleOfFifths;

            InteralPosition = new XY(0, 0);

            Amplitudes = new double[12];
            KeyIndices = new int[12];
            Color = new ColorAHSV(0, 0, 0);

            for (var i = 0; i < 12; i++)
            {
                KeyIndices[i] = new Step(i, 0).PositionCircleOfFifths;
            }
        }

        internal void Update(KeyInCircle[] keysInCircle, Pointer pointer)
        {
            UpdatePosition(keysInCircle);

            UpdateColorAHSV(pointer);
        }
        private void UpdatePosition(KeyInCircle[] keysInCircle)
        {
            for (var i = 0; i < 12; i++)
            {
                Amplitudes[i] = 0;

                for (var j = 0; j < 7; j++)
                {
                    Amplitudes[i] += keysInCircle[(i + KeyIndices[j]) % 12].Amplitude * _keyMultiplier[j];
                }
            }

            var amplitudesSum = Amplitudes.Sum();

            if (amplitudesSum > 0.0)
            {
                var maxAmplitude = Amplitudes.Max();

                for (var i = 0; i < 12; i++)
                {
                    Amplitudes[i] = MathUtils.Map(Amplitudes[i], 0, maxAmplitude, 0, 1);
                    Amplitudes[i] = Math.Pow(Amplitudes[i], 3);
                    Amplitudes[i] *= maxAmplitude;
                }
            }

            var maxAmp = double.MinValue;

            var bestPosition = 0;

            for (var i = 0; i < 12; i++)
            {
                if (Amplitudes[i] > maxAmp)
                {
                    bestPosition = i;
                    maxAmp = Amplitudes[i];
                }
            }

            var angle = bestPosition / 12.0 * (Math.PI * 2);
            var xTarget = circleOfFifths.Radius * Math.Sin(angle);
            var yTarget = circleOfFifths.Radius * -Math.Cos(angle);

            var targetPosition = new XY(xTarget, yTarget);

            InteralPosition += (targetPosition - InteralPosition) / drag;
        }
        private void UpdateColorAHSV(Pointer pointer)
        {
            var hue = (int)MathUtils.Map(Angle, 0, Math.PI * 2, 0, 360);
            var sat = (int)MathUtils.Map(InteralPosition.DistanceTo(new XY(0, 0)), 0, 1, 0, 100);
            var bri = pointer.Color.Value;

            Color = new ColorAHSV(hue, sat, bri);
        }
    }
}
