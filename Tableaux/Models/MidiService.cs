using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tableaux.API;

namespace Tableaux.Models;

internal class MidiService 
{
    private readonly HashSet<IMidiProvider> midiProviders = [];

    public MidiService()
    {
        
    }

    public void RegisterMidiProvider(IMidiProvider midiProvider)
    {
        midiProviders.Add(midiProvider);
    }

    public void RemoveMidiProvider(IMidiProvider midiProvider)
    {
        midiProviders.Remove(midiProvider);
    }

    public IMidiBuffer ReadBuffer()
    {
        var midiBuffer = MidiBuffer.Consume(midiProviders);
        return midiBuffer;
    }
}
