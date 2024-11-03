using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Geometry;
using System.Collections.Generic;
using Tableaux.Models.Designer;
using Tableaux.Models.Streams;

namespace Tableaux.Models.Scenes.Classic
{
    public class ClassicAnimationDesigner : IAnimationDesigner
    {
        private readonly Queue<int> volumeQueue = new Queue<int>();

        public string Name { get; } = "Classic";
        public double CircleOfFifthsRadius { get; set; } = 150;

        public ClassicAnimationDesigner()
        {

        }



        public Scene BuildFrame(State state, BoundingBox boundingBox)
        {
            var wrapper = new ClassicAnimationContentWrapper(state, boundingBox.Width, boundingBox.Height, volumeQueue, CircleOfFifthsRadius);
            var background = state.CircleOfFifths.KeyPointer.Color;
            var scene = new Scene(wrapper, background);
            return scene;
        }

        public void RegisterSettings(AnimationSettingsManager settingsManager)
        {
            settingsManager.Register(() => CircleOfFifthsRadius, (val) => CircleOfFifthsRadius = val, "Circle of Fifths Radius");
        }
    }
}
