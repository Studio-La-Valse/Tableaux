using System;

namespace Tableaux.API.Native.Classic
{
    public static class AnimationExtensions
    {
        public static void Lerp(this double[] values, double[] newValues, double parameter)
        {
            if (values.Length != newValues.Length)
            {
                throw new Exception("Value arrays should be of equal length.");
            }

            for (var i = 0; i < values.Length; i++)
            {
                var delta = newValues[i] - values[i];

                values[i] += delta * parameter;
            }
        }

    }
}
