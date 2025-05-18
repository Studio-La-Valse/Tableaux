using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Geometry;

namespace Tableaux.API.Native;

using StudioLaValse.Drawable;
using StudioLaValse.Drawable.Interaction.ContentWrappers;
using System;

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

public class ParticleScene : BaseInteractiveParent<int>
{
    private readonly IList<BaseVisualParticle> particles = [];

    public double Speed { get; set; } = 2;

    public ParticleScene() : base(1)
    {

    }

    private bool leftMouseDown = false;
    private int hue = 0;
    public override bool HandleLeftMouseButtonDown()
    {
        leftMouseDown = true;
        return base.HandleLeftMouseButtonDown();
    }

    public override bool HandleLeftMouseButtonUp()
    {
        leftMouseDown = false;
        return base.HandleLeftMouseButtonUp();
    }

    public override IEnumerable<BaseContentWrapper> GetContentWrappers()
    {
        return particles;
    }

    public void Update()
    {
        hue = (hue + 1) % 360;
        if (leftMouseDown)
        {
            var vector = new XY((Random.Shared.NextDouble() - 0.5) * Speed, (Random.Shared.NextDouble() - 0.5) * Speed);
            var size = Random.Shared.NextDouble() * 100;
            var color = new ColorAHSV(hue, 255, 255).ToColorARGB();
            particles.Add(new BaseVisualParticle(LastMousePosition, vector, size, color));
        }

        for (var i = particles.Count - 1; i >= 0; i--)
        {
            particles[i].Update();

            if (particles[i].LifeTime > 90)
            {
                particles.RemoveAt(i);
            }
        }
    }

    public void Clear()
    {
        particles.Clear();
    }
}

public class BaseVisualParticle : BaseContentWrapper
{
    private XY position;
    private double size;
    private ColorARGB color;
    private readonly XY vector;

    public int LifeTime { get; private set; }

    public BaseVisualParticle(XY position, XY vector, double size, ColorARGB colorARGB)
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