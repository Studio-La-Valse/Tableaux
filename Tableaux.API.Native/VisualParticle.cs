using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;

namespace Tableaux.API.Native;

public class VisualParticle : BaseContentWrapper
{
    private XY position;
    private double size;
    private ColorARGB color;
    private readonly XY vector;

    public int LifeTime { get; private set; }

    public VisualParticle(XY position, XY vector, double size, ColorARGB colorARGB)
    {
        this.position = position;
        this.vector = vector;
        this.size = size;
        this.color = colorARGB;
    }

    public void Update()
    {
        LifeTime++;
        size--;
        position += vector;
        color = new ColorARGB(color.Alpha - 0.01, color.Red, color.Green, color.Blue);
    }

    public override IEnumerable<BaseDrawableElement> GetDrawableElements()
    {
        yield return new DrawableCircle(position, size, color);
    }
}