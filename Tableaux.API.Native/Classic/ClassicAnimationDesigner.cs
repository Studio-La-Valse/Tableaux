//using StudioLaValse.Drawable.ContentWrappers;

//namespace Tableaux.API.Native.Classic
//{
//    public class ClassicAnimationDesigner : ISceneDesigner
//    {
//        private readonly Queue<int> volumeQueue = new Queue<int>();
//        private readonly IBoundsProvider boundsProvider;

//        public string Creator => "Native";
//        public string Name => "Classic";
//        public bool EnablePan => false;
//        public bool EnableZoom => false;
//        public double CircleOfFifthsRadius { get; set; } = 150;

//        public ClassicAnimationDesigner(IBoundsProvider boundsProvider)
//        {
//            this.boundsProvider = boundsProvider;
//        }

//        public BaseContentWrapper CreateScene()
//        {
//            var wrapper = new ClassicAnimationContentWrapper(state, boundingBox.Width, boundingBox.Height, volumeQueue, CircleOfFifthsRadius);
//            return wrapper;
//        }

//        public void RegisterSettings(SettingsProvider settingsManager)
//        {
//            settingsManager.Register(() => CircleOfFifthsRadius, (val) => CircleOfFifthsRadius = val, "Circle of Fifths Radius");
//        }

//    }
//}
