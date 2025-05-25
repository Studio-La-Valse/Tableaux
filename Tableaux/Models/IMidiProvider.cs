using System.Collections.Generic;
using Tableaux.API;

namespace Tableaux.Models;

internal interface IMidiProvider
{
    void ProvideBuffer(ref Queue<NoteOn> notesOn, ref Queue<NoteOff> notesOff);
}
