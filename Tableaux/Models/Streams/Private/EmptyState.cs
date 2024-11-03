using Tableaux.Models.Engine;

namespace Tableaux.Models.Streams.Private
{
    public class EmptyState : BaseState
    {
        public override Klavier CreateKlavier()
        {
            return new Klavier(new double[88]);
        }
    }
}
