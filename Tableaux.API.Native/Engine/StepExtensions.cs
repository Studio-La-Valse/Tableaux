using StudioLaValse.Geometry;
using StudioLaValse.ScoreDocument.Core;

namespace Tableaux.API.Native.Engine
{
    public static class StepExtensions
    {
        public static ColorARGB ToColorFifths(this Step step)
        {
            var stepsInOctave = 11d;
            var factor = step.PositionCircleOfFifths / stepsInOctave;
            var hsb = new ColorAHSV((int)(factor * 360), 100, 100);
            var rgb = hsb.ToColorARGB();
            var argb = new ColorARGB(rgb.Red, rgb.Blue, rgb.Green);
            return argb;
        }
    }
}
