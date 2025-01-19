using StudioLaValse.Geometry;
using StudioLaValse.ScoreDocument.Core;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace Tableaux.API.Native.Engine
{
    public class CircleOfFifths
    {
        private readonly KeyInCircle[] keys;

        public double Radius { get; set; } = 1;



        public ReadOnlyCollection<KeyInCircle> Keys =>
            keys.ToList().AsReadOnly();



        public Pointer Pointer { get; }
        public Chaser Chaser { get; }
        public KeyPointer KeyPointer { get; }



        public CircleOfFifths()
        {
            keys = new KeyInCircle[12];
            var steps = new Step[]
            {
                Step.C,
                Step.G,
                Step.D,
                Step.A,
                Step.E,
                Step.B,
                Step.FSharp,
                Step.CSharp,
                Step.AFlat,
                Step.EFlat,
                Step.BFlat,
                Step.F
            };
            for (var i = 0; i < 12; i++)
            {
                var step = steps[i];

                keys[i] = new KeyInCircle(step, this);
            }

            Pointer = new Pointer(this);
            Chaser = new Chaser(this);
            KeyPointer = new KeyPointer(this);
        }




        public void Update(Klavier klavier)
        {
            double maxValue = 0;

            foreach (var key in klavier.Keys)
            {
                maxValue = Math.Max(key.Loudness, maxValue);
            }

            foreach (var keyInCircle in Keys)
            {
                keyInCircle.Amplitude = 0;
            }

            foreach (var key in klavier.Keys)
            {
                var indexInCoF = key.Pitch.Step.PositionCircleOfFifths;

                var existingValue = Keys[indexInCoF].Amplitude;

                Keys[indexInCoF].Amplitude = Math.Max(existingValue, key.Loudness);
            }

            UpdatePointers(klavier.Centroid);
        }

        private void UpdatePointers(double klavierCentroid)
        {
            Pointer.Update(Chaser, klavierCentroid);

            KeyPointer.Update(keys, Pointer);
        }

        public static ColorAHSV ColorFromNotes(IEnumerable<Tone> notes)
        {
            var cof = new CircleOfFifths();

            foreach (var tone in notes)
            {
                var indexInCof = tone.Pitch.Step.PositionCircleOfFifths;

                var amp = tone.Amplitude / 127d;

                cof.Keys[indexInCof].Amplitude = Math.Max(amp, cof.Keys[indexInCof].Amplitude);
            }

            cof.UpdatePointers(0.5);

            return cof.Pointer.Color;
        }
    }
}
