using StudioLaValse.Geometry;
using Tableaux.API.Native.Utils;

namespace Tableaux.API.Native.Engine
{
    internal static class Utils
    {
        internal static void AlphaFromVolume(double volume, out double alpha)
        {
            alpha = MathUtils.Clamp(volume, 0, 1);
        }
        internal static void HueSatFromPositionInCircle(XY position, double radius, out int hue, out int sat)
        {
            var angle = Math.Atan2(position.X, -position.Y);

            hue = (int)MathUtils.Map(angle, 0, Math.PI * 2, 0, 360);
            sat = (int)MathUtils.Map(new XY(0, 0).DistanceTo(position), 0, radius, 0, 100);
        }
        internal static void BriFromCentroid(double klavierCentroid, out double bri)
        {
            bri = MathUtils.Clamp(klavierCentroid, 0, 1) * 100;
        }
    }
}
