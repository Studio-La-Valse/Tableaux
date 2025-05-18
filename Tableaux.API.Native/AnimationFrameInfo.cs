using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Geometry;

namespace Tableaux.API.Native;

using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Drawable.Text;

public class AnimationFrameInfo : BaseContentWrapper
{
    private readonly AnimationFrame animationFrame;
    private readonly double fontSize;
    private readonly ColorARGB color;
    private readonly FontFamilyCore fontFamilyCore;

    public AnimationFrameInfo(AnimationFrame animationFrame, double fontSize = 12, ColorARGB? color = null, FontFamilyCore? fontFamilyCore = null)
    {
        this.animationFrame = animationFrame;
        this.fontSize = fontSize;
        this.color = color ?? ColorARGB.White;
        this.fontFamilyCore = fontFamilyCore ?? new FontFamilyCore("Arial");
    }


    public override IEnumerable<BaseDrawableElement> GetDrawableElements()
    {
        var originX = animationFrame.BoundingBox.Width;
        var originY = animationFrame.BoundingBox.Height;
        var text = $"This is frame number {animationFrame.FrameNumber}";
        yield return new DrawableText(originX, originY, text, fontSize, color, HorizontalTextOrigin.Right, VerticalTextOrigin.Bottom, fontFamilyCore);

        originY -= 18;
        text = $"Elapsed: {this.animationFrame.Elapsed} ms";
        yield return new DrawableText(originX, originY, text, fontSize, color, HorizontalTextOrigin.Right, VerticalTextOrigin.Bottom, fontFamilyCore);
    }
}
