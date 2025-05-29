

function onMIDISuccess(midiAccess: MIDIAccess) {
  console.log("MIDI ready!");

  startLoggingMIDIInput(midiAccess)
}

function onMIDIFailure(msg: string) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function listInputsAndOutputs() {

    navigator.requestMIDIAccess().then(midiAccess => {
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
    },
    (message) => {
        alert(message)
    })

    
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