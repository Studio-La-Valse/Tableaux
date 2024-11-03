using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Geometry;
using Tableaux.Models.Streams;

namespace Tableaux.Models.Designer
{
    public interface IAnimationDesigner
    {
        Scene BuildFrame(State scene, BoundingBox boundingBox);
        void RegisterSettings(AnimationSettingsManager settingsManager);
    }
}
