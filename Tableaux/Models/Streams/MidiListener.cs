using Microsoft.Extensions.Logging;
using NAudio.Midi;
using StudioLaValse.ScoreDocument.Core;
using System;
using System.Collections.Generic;
using Tableaux.API;

namespace Tableaux.Models.Streams
{
    public class MidiListener : IMidiProvider, IDisposable
    {

        private readonly MidiIn _midiIn;
        private readonly ILogger<MidiListener> logger;
        private readonly HashSet<Pitch> notesCurrentlyPressed = [];
        private readonly HashSet<Pitch> notesCurrentlySustained = [];
        private readonly Queue<NoteOn> notesOn = [];
        private readonly Queue<NoteOff> notesOff = [];
        private bool sustainPressed;
        private bool disposedValue;

        public MidiListener(MidiIn midiIn, ILogger<MidiListener> logger)
        {
            _midiIn = midiIn;
            this.logger = logger;
        }

        public void Start()
        {
            _midiIn.MessageReceived += MessageReceived;
            _midiIn.ErrorReceived += ErrorReceived;
            _midiIn.Start();
        }


        private void MessageReceived(object? sender, MidiInMessageEventArgs e)
        {
            switch (e.MidiEvent.CommandCode)
            {
                case MidiCommandCode.NoteOn:
                    NoteOnReceived(e.MidiEvent);
                    return;

                case MidiCommandCode.NoteOff:
                    NoteOffReceived(e.MidiEvent);
                    return;

                case MidiCommandCode.ControlChange:
                    ControlChangeReceived(e.MidiEvent);
                    return;

                default: return;
            }

        }
        private void ErrorReceived(object? sender, MidiInMessageEventArgs e)
        {
            logger.LogError("The following midi event has thrown an error {0}", e.MidiEvent);
            Stop();
        }

        private void NoteOnReceived(MidiEvent midiEvent)
        {
            if (midiEvent is not NoteEvent noteEvent)
            {
                throw new InvalidCastException();
            }

            var noteOn = noteEvent.ToNoteOn();
            notesOn.Enqueue(noteOn);
            notesCurrentlyPressed.Add(noteOn.Pitch);

            if (sustainPressed)
            {
                notesCurrentlySustained.Add(noteOn.Pitch);
            }
        }

        private void NoteOffReceived(MidiEvent midiEvent)
        {
            if (midiEvent is not NoteEvent noteEvent)
            {
                throw new InvalidCastException();
            }

            var noteOff = noteEvent.ToNoteOff();
            notesCurrentlyPressed.Remove(noteOff.Pitch);

            // if the sustain pedal is pressed, dont add the note to the noteoff buffer.
            if (sustainPressed)
            {
                
            }
            else
            {
                notesOff.Enqueue(noteOff);
            }
        }

        private void ControlChangeReceived(MidiEvent midiEvent)
        {
            if (midiEvent is not ControlChangeEvent controllerEvent)
            {
                throw new InvalidCastException();
            }

            if (controllerEvent.Controller != MidiController.Sustain)
            {
                return;
            }

            sustainPressed = controllerEvent.ControllerValue > 64;

            // If the sustain pedal is pressed, all notes currently pressed must be added to the sustain buffer
            // If the sustain pedal is released, all notes not currently pressed must be added to the noteoff buffer, then the sustain buffer must be cleared.
            if (sustainPressed)
            {
                foreach(var item in notesCurrentlyPressed)
                {
                    notesCurrentlySustained.Add(item);
                }
            }
            else
            {
                foreach(var item in notesCurrentlySustained)
                {
                    if (!notesCurrentlyPressed.Contains(item))
                    {
                        notesOff.Enqueue(new NoteOff(item));
                    }
                }

                notesCurrentlySustained.Clear();
            }
        }
        public void ProvideBuffer(ref Queue<NoteOn> notesOn, ref Queue<NoteOff> notesOff)
        {
            while (this.notesOn.Count > 0)
            {
                notesOn.Enqueue(this.notesOn.Dequeue());
            }

            while (this.notesOff.Count > 0)
            {
                notesOff.Enqueue(this.notesOff.Dequeue());
            }
        }

        public void Stop()
        {
            _midiIn.MessageReceived -= MessageReceived;
            _midiIn.ErrorReceived -= ErrorReceived;
            _midiIn.Stop();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects)
                    _midiIn.Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
                // TODO: set large fields to null
                disposedValue = true;
            }
        }

        // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
        // ~MidiListener()
        // {
        //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        //     Dispose(disposing: false);
        // }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
