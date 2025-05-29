import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { NoteOffMidiMessage, NoteOnMidiMissage, parse } from './services/midi-listener-service'

const app = createApp(App)

app.use(router)

app.mount('#app')

let midi: MIDIAccess | null = null; // global MIDIAccess object
function onMIDISuccess(midiAccess: MIDIAccess) {
  console.log("MIDI ready!");
  midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
 listInputsAndOutputs(midi)

  startLoggingMIDIInput(midi)
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function listInputsAndOutputs(midiAccess) {
    for (const entry of midiAccess.inputs) {
      const input = entry[1];
      console.log(
        `Input port [type:'${input.type}']` +
          ` id:'${input.id}'` +
          ` manufacturer:'${input.manufacturer}'` +
          ` name:'${input.name}'` +
          ` version:'${input.version}'`,
      );
    }
  
    for (const entry of midiAccess.outputs) {
      const output = entry[1];
      console.log(
        `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`,
      );
    }
  }

  function onMIDIMessage(event: MIDIMessageEvent) {
    let message = parse(event);
    if (message instanceof NoteOnMidiMissage || message instanceof NoteOffMidiMessage){

    console.log(message);
    }
  }
  
  function startLoggingMIDIInput(midiAccess) {
    midiAccess.inputs.forEach((entry) => {
      entry.onmidimessage = onMIDIMessage;
    });
  }