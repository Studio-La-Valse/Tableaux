using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Geometry;

namespace Tableaux.API.Native;

using NAudio.Wave;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Drawable.Text;

public class AnimationFrameInfo : BaseContentWrapper
{
    private readonly double fontSize;
    private readonly ColorARGB color;
    private readonly FontFamilyCore fontFamilyCore;
    private AnimationFrame? animationFrame;

    public AnimationFrameInfo(double fontSize = 18, ColorARGB? color = null, FontFamilyCore? fontFamilyCore = null)
    {
        this.fontSize = fontSize;
        this.color = color ?? ColorARGB.White;
        this.fontFamilyCore = fontFamilyCore ?? new FontFamilyCore("Arial");
    }

    public void Update(AnimationFrame animationFrame)
    {
        this.animationFrame = animationFrame;
    }

    public override IEnumerable<BaseDrawableElement> GetDrawableElements()
    {
        if (this.animationFrame is null)
        {
            yield break;
        }

        var animationFrame = this.animationFrame.Value;

        var originX = animationFrame.BoundingBox.Width;
        var originY = animationFrame.BoundingBox.Height;
        var text = $"This is frame number {animationFrame.FrameNumber}";
        yield return new DrawableText(originX, originY, text, fontSize, color, HorizontalTextOrigin.Right, VerticalTextOrigin.Bottom, fontFamilyCore);

        originY -= fontSize * 1.5;
        text = $"Elapsed: {animationFrame.Elapsed} ms";
        yield return new DrawableText(originX, originY, text, fontSize, color, HorizontalTextOrigin.Right, VerticalTextOrigin.Bottom, fontFamilyCore);
    }
}
