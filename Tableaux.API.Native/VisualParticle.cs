using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;

namespace Tableaux.API.Native;

public class VisualParticle : BaseContentWrapper
{
    private XY position;
    private readonly double initialSize;
    private double size;
    private readonly double decay;
    private ColorARGB color;
    private readonly XY vector;

    public int LifeTime { get; private set; }

    public VisualParticle(XY position, XY vector, double size, double decay, ColorARGB colorARGB)
    {
        this.position = position;
        this.vector = vector;
        this.initialSize = size;
        this.size = size;
        this.decay = decay;
        this.color = colorARGB;
    }

    public void Update()
    {
        LifeTime++;
        size -= decay;
        position += vector;
        color = new ColorARGB(color.Alpha - decay / initialSize, color.Red, color.Green, color.Blue);
    }

    public override IEnumerable<BaseDrawableElement> GetDrawableElements()
    {
        yield return new DrawableCircle(position, size, color);
    }
}