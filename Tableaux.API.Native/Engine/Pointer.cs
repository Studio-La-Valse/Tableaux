using StudioLaValse.Geometry;
using StudioLaValse.ScoreDocument.Core;
using System.Collections.Generic;
using System.Linq;

namespace Tableaux.API.Native.Engine
{
    public class Pointer
    {
        private readonly CircleOfFifths circleOfFifths;
        private readonly Queue<(XY, double)> positionQueue;
        private readonly int _numberOfPositions = 25;


        public XY Position { get; private set; }
        public ColorAHSV Color { get; private set; }



        public Pointer(CircleOfFifths circleOfFifths)
        {
            this.circleOfFifths = circleOfFifths;
            positionQueue = new Queue<(XY, double)>();

            Position = new XY(0, 0);
            Color = new ColorAHSV(0, 0, 0, 0);
        }


        internal void Update(Chaser chaser, double klavierCentroid)
        {
            UpdatePosition(klavierCentroid);

            UpdateColor();

            chaser.Update(Position, Color);
        }

        private void UpdatePosition(double klavierCentroid)
        {
            var position = new XY(0, 0);

            var loudestKey = circleOfFifths.Keys.Select(key => key.Amplitude).Max();

            if (loudestKey > 0.0001)
            {
                var weightSum = 0d;

                foreach (var key in circleOfFifths.Keys)
                {
                    var weight = key.Amplitude / loudestKey;

                    position += key.PositionInCircle * weight;

                    weightSum += weight;
                }

                position /= weightSum;
            }

            Utils.BriFromCentroid(klavierCentroid, out var bri);

            positionQueue.Enqueue((position, bri));

            while (positionQueue.Count > _numberOfPositions)
            {
                positionQueue.Dequeue();
            }

            var averageInQueueX = positionQueue.Select(p => p.Item1.X).Sum() / positionQueue.Count;

            var averageInQueueY = positionQueue.Select(p => p.Item1.Y).Sum() / positionQueue.Count;

            Position = new XY(averageInQueueX, averageInQueueY);
        }

        private void UpdateColor()
        {
            var sumBri = positionQueue.Sum(p => p.Item2);

            var avgBri = sumBri / positionQueue.Count;

            Utils.HueSatFromPositionInCircle(Position, circleOfFifths.Radius, out var hue, out var sat);

            Utils.AlphaFromVolume(circleOfFifths.Keys.Select(key => key.Amplitude).Max(), out var alpha);

            Color = new ColorAHSV(alpha, hue, sat, (int)avgBri);
        }
    }
}
