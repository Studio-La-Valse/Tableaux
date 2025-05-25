using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tableaux.API;

namespace Tableaux.Models;

public class MidiService 
{
    private IMidiProvider? midiProvider;

    public MidiService()
    {
        
    }

    public void RegisterMidiProvider(IMidiProvider midiProvider)
    {
        this.midiProvider = midiProvider;
    }

    public IMidiBuffer ReadBuffer()
    {
        if (this.midiProvider == null)
        {
            var msg = "";
            throw new Exception(msg);
        }

        var midiBuffer = MidiBuffer.Consume(midiProvider);
        return midiBuffer;
    }
}
