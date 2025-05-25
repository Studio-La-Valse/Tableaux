using System.Collections.Generic;
using Tableaux.API;

namespace Tableaux.Models;

internal class MidiBuffer : IMidiBuffer
{
    private readonly IEnumerable<NoteOn> notesOn;
    private readonly IEnumerable<NoteOff> notesOff;

    public MidiBuffer(IEnumerable<NoteOn> notesOn, IEnumerable<NoteOff> notesOff)
    {
        this.notesOn = notesOn;
        this.notesOff = notesOff;
    }

    public static IMidiBuffer Consume(Queue<NoteOn> notesOn, Queue<NoteOff> notesOff)
    {
        var _notesOn = new List<NoteOn>();   
        var _notesOff = new List<NoteOff>();

        while (notesOn.Count > 0)
        {
            _notesOn.Add(notesOn.Dequeue());
        }

        while(notesOff.Count > 0)
        {
            _notesOff.Add(notesOff.Dequeue());
        }

        return new MidiBuffer(notesOn, _notesOff);
    }

    public static IMidiBuffer Consume(IEnumerable<IMidiProvider> midiProviders)
    {
        var notesOn = new Queue<NoteOn>();
        var notesOff = new Queue<NoteOff>();

        foreach (var provider in midiProviders)
        {
            provider.ProvideBuffer(ref notesOn, ref notesOff);
        }

        var midiBuffer = Consume(notesOn, notesOff);
        return midiBuffer;
    }

    public IEnumerable<NoteOff> NotesOff()
    {
        return notesOff;
    }

    public IEnumerable<NoteOn> NotesOn()
    {
        return notesOn;
    }
}