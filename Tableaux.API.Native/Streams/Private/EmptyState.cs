using Tableaux.API.Native.Engine;
using Tableaux.API.Native.Streams;

namespace Tableaux.API.Native.Streams.Private
{
    public class EmptyState : BaseState
    {
        public override Klavier CreateKlavier()
        {
            return new Klavier(new double[88]);
        }
    }
}
