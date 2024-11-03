using StudioLaValse.Geometry;
using StudioLaValse.ScoreDocument.Core;

namespace Tableaux.Models.Engine
{
    public static class StepExtensions
    {
        public static ColorHSB ToColorFifths(this Step step)
        {
            var stepsInOctave = 11d;
            var factor = step.PositionCircleOfFifths / stepsInOctave;
            return new ColorHSB(factor, 1, 0.5);
        }
    }
}
