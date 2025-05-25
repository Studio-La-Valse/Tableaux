using System.Collections.Generic;
using Tableaux.API;

namespace Tableaux.Models;

public interface IMidiProvider
{
    void ProvideBuffer(ref Queue<NoteOn> notesOn, ref Queue<NoteOff> notesOff);
}
