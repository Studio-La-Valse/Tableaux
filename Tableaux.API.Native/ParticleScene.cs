using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Geometry;

namespace Tableaux.API.Native;

using StudioLaValse.Drawable.Interaction.ContentWrappers;
using System;

public class ParticleScene : BaseInteractiveParent<int>
{
    private readonly IList<VisualParticle> particles = [];
    private bool leftMouseDown = false;
    private int hue = 0;

    public double Speed { get; set; } = 2;
    public int SpawnCount { get; set; } = 1;
    public int MaxLife { get; set; } = 100;
    public double Decay { get; set; } = 1.0;

    public ParticleScene() : base(1)
    {

    }


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
        foreach (var particle in particles)
        {
            yield return particle;
        }
    }

    public void Update(AnimationFrame animationFrame)
    {
        if (leftMouseDown)
        {
            hue = (hue + 1) % 360;

            Add(SpawnCount);
        }

        for (var i = particles.Count - 1; i >= 0; i--)
        {
            particles[i].Update();

            if (particles[i].LifeTime > MaxLife)
            {
                particles.RemoveAt(i);
            }
        }
    }

    public void AddOne()
    {
        var vector = new XY((Random.Shared.NextDouble() - 0.5) * Speed, (Random.Shared.NextDouble() - 0.5) * Speed);
        var size = Random.Shared.NextDouble() * 100;
        var color = new ColorAHSV(hue, 255, 255).ToColorARGB();
        var particle = new VisualParticle(LastMousePosition, vector, size, Decay, color);

        particles.Add(particle);
    }

    public void Add(int spawnCount)
    {
        for (var i = 0; i < spawnCount; i++)
        {
            AddOne();
        }
    }

    public void Clear()
    {
        particles.Clear();
    }
}
