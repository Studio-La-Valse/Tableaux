using StudioLaValse.Geometry;

namespace Tableaux.API
{
    public struct AnimationFrame
    {
        public long FrameNumber { get; }
        public double Elapsed { get; }
        public BoundingBox BoundingBox { get; }
        public XY Translation { get; }
        public double ZoomFactor { get; }

        public AnimationFrame(long frameNumber, double elapsed, BoundingBox boundingBox, XY translation, double zoomFactor)
        {
            FrameNumber = frameNumber;
            Elapsed = elapsed;
            BoundingBox = boundingBox;
            Translation = translation;
            ZoomFactor = zoomFactor;
        }
    }
}
