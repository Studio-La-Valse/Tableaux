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
        public timestamp: number,
        public channel: number,
        public key: number, 
        public velocity: number
    ){
        super(timestamp);
    }
}

export class KeyPressureMidiMessage extends MidiMessage{
    constructor(
        public timestamp: number,
        public channel: number,
        public key: number, 
        public pressure: number
    ){
        super(timestamp);
    }
}

export class ControllerChangeMidiMessage extends MidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
        public controllerNumber: number, 
        public controllerValue: number
    ){
        super(timestamp);
    }
}

export class AllSoundOffControllerChangeMidiMessage extends ControllerChangeMidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
    ){
        super(timestamp, channel, 120, 0);
    }
}

export class ResetAllControllersControllerChangeMidiMessage extends ControllerChangeMidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
        public controllerValue: number
    ){
        super(timestamp, channel, 121, controllerValue);
    }
}

export class LocalControlOffControllerChangeMidiMessage extends ControllerChangeMidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
    ){
        super(timestamp, channel, 122, 0);
    }
}

export class LocalControlOnControllerChangeMidiMessage extends ControllerChangeMidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
        public controllerValue: number
    ){
        super(timestamp, channel, 122, controllerValue);
    }
}

export class AllNotesOffControllerChangeMidiMessage extends ControllerChangeMidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
    ){
        super(timestamp, channel, 123, 0);
    }
}

export class OmniModeOffControllerChangeMidiMessage extends ControllerChangeMidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
    ){
        super(timestamp, channel, 124, 0);
    }
}

export class OmniModeOnControllerChangeMidiMessage extends ControllerChangeMidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
    ){
        super(timestamp, channel, 125, 0);
    }
}

export class MonoModeOnControllerChangeMidiMessage extends ControllerChangeMidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
        public controllerValue: number
    ){
        super(timestamp, channel, 126, controllerValue);
    }
}

export class PolyModeOnControllerChangeMidiMessage extends ControllerChangeMidiMessage{
     constructor(
        public timestamp: number,
        public channel: number,
        public controllerValue: number
    ){
        super(timestamp, channel, 127, controllerValue);
    }
}

export class ProgramChangeMidiMessage extends MidiMessage{
    constructor(
        public timestamp: number,
        public channel: number,
        public program: number
    ){
        super(timestamp);
    }
}

export class ChannelPressureMidiMessage extends MidiMessage{
    constructor(
        public timestamp: number,
        public channel: number,
        public pressure: number
    ){
        super(timestamp);
    }
}

export class PitchBendChangeMidiMessage extends MidiMessage{
    constructor(
        public timestamp: number,
        public channel: number,
        public pitchBend: number
    ){
        super(timestamp);
    }
}

export function parse(event: MIDIMessageEvent): MidiMessage{
	let msg: string | undefined;
        
    let data = event.data;
    if (data === null){
        msg = "Invalid midi message because it contains no data."
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
    let pressure: number | undefined;

    switch(_messageCode){

        // Note Off
        case 0x80:
            key = data[1] & 0x7F;
            velocity = data[2] & 0x7F;
            message = new NoteOffMidiMessage(timeStamp, channel, key, velocity);
            break;

        // Note On
        case 0x90:
            key = data[1] & 0x7F;
            velocity = data[2] & 0x7F;
            message = new NoteOnMidiMissage(timeStamp, channel, key, velocity)
            break;

        // Polyphonic Key Pressure
        case 0xA0:
            key = data[1] & 0x7F;
            pressure = data[2] & 0x7F;
            message = new KeyPressureMidiMessage(timeStamp, channel, key, pressure)
        break;

        // Control Change
        case 0xB0:
            let controllerNumber = data[1] & 0x7F;
            let controllerValue = data[2] & 0x7F;

            if (controllerNumber === 120 && controllerValue === 0){
                message = new AllSoundOffControllerChangeMidiMessage(timeStamp, channel)
                break;
            }

            if (controllerNumber === 121){
                message = new ResetAllControllersControllerChangeMidiMessage(timeStamp, channel, controllerValue);
                break;
            }
            
            if (controllerNumber === 122){
                if (controllerValue === 0){
                    message = new LocalControlOffControllerChangeMidiMessage(timeStamp, channel)
                    break;
                }

                message = new LocalControlOnControllerChangeMidiMessage(timeStamp, channel, controllerValue);
                break;
            }

            if (controllerNumber === 123 && controllerValue === 0){
                message = new AllNotesOffControllerChangeMidiMessage(timeStamp, channel)
                break;
            }

            if (controllerNumber === 124 && controllerValue === 0){
                message = new OmniModeOffControllerChangeMidiMessage(timeStamp, channel)
                break;
            }

            if (controllerNumber === 125 && controllerValue === 0){
                message = new OmniModeOnControllerChangeMidiMessage(timeStamp, channel);
                break;
            }

            if (controllerNumber === 126){
                message = new MonoModeOnControllerChangeMidiMessage(timeStamp, channel, controllerValue);
                break;
            }
            
            if (controllerNumber === 127){
                message = new PolyModeOnControllerChangeMidiMessage(timeStamp, channel, controllerValue);
                break;
            }

            msg = `The combination of controller number ${controllerNumber} and -value ${controllerValue} are not recognized.`;
            throw new Error(msg);

        // Program Change
        case 0xC0:
            let program = data[1];
            message = new ProgramChangeMidiMessage(timeStamp, channel, program);
        break;

        // Channel Pressure
        case 0xD0:
            pressure = data[1] & 0x7F;
            message = new ChannelPressureMidiMessage(timeStamp, channel, pressure);
        break;

        // Pitch Bend Change
        case 0xE0:
            var msb = data[2] & 0x7F;
            var lsb = data[1] & 0x7F;
            let pitchBend = (msb << 7) + lsb;
            message = new PitchBendChangeMidiMessage(timeStamp, channel, pitchBend);
        break;

        default:
            msg = `Message ${_messageCode} is undefined.`
            throw new Error(msg)
    }

    return message
}
