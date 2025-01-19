using StudioLaValse.Drawable.BitmapPainters;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Drawable.Extensions;
using StudioLaValse.Geometry;
using System.Collections.Generic;

namespace Tableaux.API
{
    public class Scene(BaseContentWrapper baseContentWrapper, ColorARGB? background)
    {
        public BaseContentWrapper BaseContentWrapper { get; } = baseContentWrapper;
        public ColorARGB? Background { get; } = background;
    }
}
