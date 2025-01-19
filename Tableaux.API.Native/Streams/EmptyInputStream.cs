using Tableaux.API.Native.Streams.Private;

namespace Tableaux.API.Native.Streams
{
    public class EmptyInputStream : BaseEmptyInputStream
    {
        public EmptyInputStream()
        {

        }

        public override void StartStream()
        {
            base.StartStream();
        }

        public override void StopStream()
        {
            base.StopStream();
        }

        public override BaseState GetState()
        {
            return new EmptyState();
        }
    }
}
