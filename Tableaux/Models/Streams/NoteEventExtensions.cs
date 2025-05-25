using NAudio.Midi;
using StudioLaValse.ScoreDocument.Core;
using System.Linq;
using Tableaux.API;

namespace Tableaux.Models.Streams
{
    public static class NoteEventExtensions
    {
        private static readonly Step[] steps = new Scale(Step.A, ScaleStructure.Chromatic).EnumerateSteps(12).ToArray();

        public static NoteOn ToNoteOn(this NoteEvent noteEvent)
        {
            var noteNumber = noteEvent.NoteNumber - 21;
            noteNumber += 12;

            var step = steps[noteNumber % 12];
            var octave = noteNumber / 12;
            var pitch = new Pitch(step, octave);

            var noteOn = new NoteOn(pitch, noteEvent.Velocity);
            return noteOn;
        }

        public static NoteOff ToNoteOff(this NoteEvent noteEvent)
        {
            var noteNumber = noteEvent.NoteNumber - 21;
            noteNumber += 12;

            var step = steps[noteNumber % 12];
            var octave = noteNumber / 12;
            var pitch = new Pitch(step, octave);

            var noteOn = new NoteOff(pitch);
            return noteOn;
        }

        public static Pitch ToNotePitch(this NoteEvent noteEvent)
        {
            var noteNumber = noteEvent.NoteNumber - 21;
            noteNumber += 12;

            var step = steps[noteNumber % 12];
            var octave = noteNumber / 12;
            var pitch = new Pitch(step, octave);
            return pitch;
        }
    }
}
