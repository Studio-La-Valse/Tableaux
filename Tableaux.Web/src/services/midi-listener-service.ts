export class MidiMessage{
    constructor(public timestamp: number){

    }
}

export class NoteOffMidiMessage extends MidiMessage{

    constructor(
        public timestamp: number,
        public channel: number, 
        public key: number, 
        public velocity: number) {
            super(timestamp);
        
    }
}

export class NoteOnMidiMissage extends MidiMessage{
    constructor(
        public channel: number,
        public key: number, 
        public velocity: number
    ){
        super();
    }
}

export function parse(event: MIDIMessageEvent): MidiMessage{
	let data = event.data;
    if (data === null){
        let msg = "Invalid midi message because it contains no data."
        throw new Error(msg);
    }

	let timeStamp = event.timeStamp;

	if (data.length < 2){
		return new MidiMessage(timeStamp);
    }

    let _messageCode = data[0] & 0xf0;
    let channel = (data[0] & 0x0f)+1;
    let message: MidiMessage | undefined;
    let key: number | undefined;
    let velocity: number | undefined;
    switch(_messageCode){

        // Note Off
        case 0x80:
            key = data[1] & 0x7F;
            velocity = data[2] & 0x7F;
            message = new NoteOffMidiMessage(channel, key, velocity);
            break;

        // Note On
        case 0x90:
            key = data[1] & 0x7F;
            velocity = data[2] & 0x7F;
            message = new NoteOnMidiMissage(channel, key, velocity)
            break;

        // Polyphonic Key Pressure
        case 0xA0:
            this.messageType = "keypressure";
            this.key = event.data[1] & 0x7F;
            this.pressure = event.data[2] & 0x7F;
        break;

        // Control Change
        case 0xB0:
            this.messageType = "controlchange";
            this.controllerNumber = event.data[1] & 0x7F;
            this.controllerValue = event.data[2] & 0x7F;

            if (this.controllerNumber === 120 && this.controllerValue === 0){
                this.channelModeMessage = "allsoundoff";
            }
            else if (this.controllerNumber === 121){
                this.channelModeMessage = "resetallcontrollers";
            }
            else if (this.controllerNumber === 122){
                if (this.controllerValue === 0){
                    this.channelModeMessage =  "localcontroloff";
                }else{
                    this.channelModeMessage =  "localcontrolon";
                }
            }
            else if (this.controllerNumber === 123 && this.controllerValue === 0){
                this.channelModeMessage = "allnotesoff";
            }
            else if (this.controllerNumber === 124 && this.controllerValue === 0){
                this.channelModeMessage = "omnimodeoff";
            }
            else if (this.controllerNumber === 125 && this.controllerValue === 0){
                this.channelModeMessage = "omnimodeon";
            }
            else if (this.controllerNumber === 126){
                this.channelModeMessage = "monomodeon";
            }
            else if (this.controllerNumber === 127){
                this.channelModeMessage = "polymodeon";
            }
        break;

        // Program Change
        case 0xC0:
            this.messageType = "programchange";
            this.program = event.data[1];
        break;

        // Channel Pressure
        case 0xD0:
            this.messageType = "channelpressure";
            this.pressure = event.data[1] & 0x7F;
        break;

        // Pitch Bend Change
        case 0xE0:
            this.messageType = "pitchbendchange";
            var msb = event.data[2] & 0x7F;
            var lsb = event.data[1] & 0x7F;
            this.pitchBend = (msb << 7) + lsb;
        break;
    }

    if (message === undefined){
        let msg = `Message ${_messageCode} is undefined.`
        throw new Error(msg)
    }

    return message
}
