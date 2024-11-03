using NAudio.Midi;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Tableaux.Models.Engine;
using Tableaux.Models.Utils;

namespace Tableaux.Models.Streams.Private
{
    public class MidiListenerInputStream : BaseMidiListenerInputStream
    {
        private readonly MidiIn _midiIn;
        private readonly List<MidiInCapabilities> _devices;
        private readonly List<int> _depressedQueue;




        private float[] FloatKeyValues { get; }
        public bool SustainPressed { get; private set; }
        public Queue<Tone> NotesOn { get; } = new Queue<Tone>();
        public Queue<Tone> NotesOff { get; } = new Queue<Tone>();
        public override int[] KeyValues =>
            FloatKeyValues.Select(value => (int)value).ToArray();
        public float FadingFactor =>
            0.995f;


        public MidiListenerInputStream(int deviceIndex = 0)
        {
            FloatKeyValues = new float[88];

            _depressedQueue = new List<int>();

            _devices = new List<MidiInCapabilities>();

            for (var device = 0; device < MidiIn.NumberOfDevices; device++)
            {
                _devices.Add(MidiIn.DeviceInfo(device));
            }

            if (!_devices.Any())
            {
                throw new Exception("No MIDI devices found!");
            }

            _midiIn = new MidiIn(deviceIndex);
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
            Debug.WriteLine(e.MidiEvent.ToString());

            StopStream();
        }
        private void NoteOnReceived(MidiEvent midiEvent)
        {
            if (!(midiEvent is NoteEvent noteEvent))
            {
                throw new InvalidCastException();
            }

            Console.WriteLine($"{midiEvent.CommandCode} " +
                $"note {noteEvent.NoteName} : " +
                $"number {noteEvent.NoteNumber} : " +
                $"velocity: {noteEvent.Velocity}");

            var noteNumber = noteEvent.NoteNumber - 21;

            NotesOn.Enqueue(new Tone(noteNumber.ToPitch(), noteEvent.Velocity));

            FloatKeyValues[noteNumber] = noteEvent.Velocity;

            for (var i = 0; i < _depressedQueue.Count; i++)
            {
                if (_depressedQueue[i] == noteNumber)
                {
                    _depressedQueue.RemoveAt(i);

                    break;
                }
            }
        }
        private void NoteOffReceived(MidiEvent midiEvent)
        {
            if (!(midiEvent is NoteEvent noteEvent))
            {
                throw new InvalidCastException();
            }

            Console.WriteLine($"{midiEvent.CommandCode} " +
                $"note {noteEvent.NoteName} : " +
                $"number {noteEvent.NoteNumber}");

            var noteNumber = noteEvent.NoteNumber - 21;

            NotesOff.Enqueue(new Tone(noteNumber.ToPitch(), 0));

            if (SustainPressed)
            {
                _depressedQueue.Add(noteNumber);

                return;
            }

            FloatKeyValues[noteNumber] = 0;
        }
        private void ControlChangeReceived(MidiEvent midiEvent)
        {
            if (!(midiEvent is ControlChangeEvent controllerEvent))
            {
                throw new InvalidCastException();
            }

            if (controllerEvent.Controller != MidiController.Sustain)
            {
                return;
            }

            SustainPressed = controllerEvent.ControllerValue > 64;

            if (!SustainPressed)
            {
                foreach (var noteNumber in _depressedQueue)
                {
                    FloatKeyValues[noteNumber] = 0;
                }

                _depressedQueue.Clear();
            }
        }
        public override void MissedMessages(out List<Tone> notesOn, out List<Tone> notesOff)
        {
            notesOn = new List<Tone>();
            notesOff = new List<Tone>();

            while (NotesOn.Any())
            {
                notesOn.Add(NotesOn.Dequeue());
            }

            while (NotesOff.Any())
            {
                notesOff.Add(NotesOff.Dequeue());
            }
        }


        public override void StartStream()
        {
            _midiIn.Start();

            _midiIn.MessageReceived += MessageReceived;
            _midiIn.ErrorReceived += ErrorReceived;

            base.StartStream();
        }
        public override void StopStream()
        {
            _midiIn.Stop();

            _midiIn.MessageReceived -= MessageReceived;
            _midiIn.ErrorReceived -= ErrorReceived;

            base.StopStream();
        }
        public void Fade()
        {
            for (var i = 0; i < FloatKeyValues.Length; i++)
            {
                var value = FloatKeyValues[i];

                FloatKeyValues[i] = value * FadingFactor;
            }
        }
    }


}
