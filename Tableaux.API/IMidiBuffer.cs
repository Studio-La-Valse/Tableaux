namespace Tableaux.API
{
    public interface IMidiBuffer
    {
        IEnumerable<NoteOn> NotesOn();
        IEnumerable<NoteOff> NotesOff();
    }
}
