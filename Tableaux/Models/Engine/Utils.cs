using StudioLaValse.Geometry;
using System;
using Tableaux.Models.Utils;

namespace Tableaux.Models.Engine
{
    internal static class Utils
    {
        internal static void AlphaFromVolume(double volume, out double alpha)
        {
            alpha = MathUtils.Clamp(volume, 0, 1) * ColorHSB.MaxValue;
        }
        internal static void HueSatFromPositionInCircle(XY position, double radius, out double hue, out double sat)
        {
            var angle = Math.Atan2(position.X, -position.Y);

            hue = MathUtils.Map(angle, 0, Math.PI * 2, 0, ColorHSB.MaxValue);
            sat = MathUtils.Map(new XY(0, 0).DistanceTo(position), 0, radius, 0, ColorHSB.MaxValue);
        }
        internal static void BriFromCentroid(double klavierCentroid, out double bri)
        {
            bri = MathUtils.Clamp(klavierCentroid, 0, 1) * ColorHSB.MaxValue;
        }
    }
}
