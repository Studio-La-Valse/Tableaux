using StudioLaValse.Geometry;

namespace Tableaux.API
{
    public interface ICanvasService
    {
        BoundingBox Bounds { get; }
        double Zoom { get; set; }
        double TranslateX { get; set; }
        double TranslateY { get; set; }
        bool EnablePan { get; set; }
        bool EnableZoom { get; set; }
    }
}
