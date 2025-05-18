using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;

namespace Tableaux.API.Native;

using StudioLaValse.Drawable;

public class TestScene : BaseVisualParent<int>
{
    private readonly ICanvasService canvasService;

    public double X { get; set; }
    public double Y { get; set; }
    public double Radius { get; set; } = 50;

    public TestScene(ICanvasService canvasService) : base(1)
    {
        this.canvasService = canvasService;
    }

    public void SetRadius(double radius)
    {
        Radius = radius;    
    }

    public override IEnumerable<BaseDrawableElement> GetDrawableElements()
    {
        var center = canvasService.Bounds.Center;
        yield return new DrawableCircle(center, Radius, ColorARGB.White);
    }
}
