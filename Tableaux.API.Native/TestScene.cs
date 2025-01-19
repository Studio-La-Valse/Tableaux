using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;

namespace Tableaux.API.Native;
using System;

public class TestScene : BaseVisualParent<int>
{
    private readonly ICanvasService canvasService;

    public double X { get; set; }
    public double Y { get; set; }
    public double Radius { get; set; } = 50;
    public double CurrentRotation { get; set; } = 0;

    public TestScene(ICanvasService canvasService) : base(1)
    {
        this.canvasService = canvasService;
    }

    public void Rotate()
    {
        var angleInRadians = CurrentRotation * (Math.PI / 180.0);

        X = Radius * Math.Cos(angleInRadians);
        Y = Radius * Math.Sin(angleInRadians);

        CurrentRotation = (CurrentRotation + 2) % 360;
    }

    public override IEnumerable<BaseDrawableElement> GetDrawableElements()
    {
        var centerX =  ((canvasService.Bounds.MaxPoint.X - canvasService.Bounds.MinPoint.X) / 2);
        var centerY = ((canvasService.Bounds.MaxPoint.Y - canvasService.Bounds.MinPoint.Y) / 2);
        yield return new DrawableCircle(new XY(X + centerX, Y + centerY), Radius, ColorARGB.White);
    }
}
