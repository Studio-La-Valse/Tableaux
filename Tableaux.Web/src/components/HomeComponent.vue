<script setup lang="ts">
import { MidiMessage, NoteOnMidiMissage, parse } from '@/models/midi-message';
import { ref, type Ref } from 'vue';

const messages: Ref<MidiMessage[]> = ref([]);

const onClick = () => {

    navigator.requestMIDIAccess().then(
        midiAccess => {
            midiAccess.inputs.forEach((entry) => {
                entry.onmidimessage = onMIDIMessage;
            });
        }, 
        failureReason => {
            alert(failureReason)
        }
    )

}

function onMIDIMessage(message: MIDIMessageEvent){
    const parsedMessage = parse(message)
    messages.value.push(parsedMessage)

    while (messages.value.length > 8){
        messages.value.splice(0, 1)
    }
}

</script>

<template>
    <h1>Hello, world!</h1>

    <button @click="onClick" type="button">Start listening</button>

    <li v-for="message in messages">
        {{ message }}
    </li>
</template>

<style lang="css" scoped>

</style>