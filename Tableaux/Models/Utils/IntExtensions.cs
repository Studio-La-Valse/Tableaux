using StudioLaValse.ScoreDocument.Core;
using System.Linq;

namespace Tableaux.Models.Utils
{
    public static class IntExtensions
    {
        private static readonly Step[] steps = new Scale(Step.A, ScaleStructure.Chromatic).EnumerateSteps(12).ToArray();

        public static Pitch ToPitch(this int i)
        {
            i += 12;

            var step = steps[i % 12];
            var octave = i / 12;
            return new Pitch(step, octave);
        }
    }
}
