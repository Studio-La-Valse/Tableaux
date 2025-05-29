<script setup lang="ts">
import { MidiMessage, parse } from '@/models/midi-message';
import { ref, watch, onUnmounted, type Ref } from 'vue';

const messages: Ref<MidiMessage[]> = ref([]);
const midiAccess = ref<MIDIAccess | null>(null);
const listening = ref(false);
const buttonContent = ref("Start Listening");

watch(listening, (nowListening) => {
    buttonContent.value = nowListening ? "Stop listening" : "Start listening";
});

const cleanupMIDI = () => {
    if (!midiAccess.value) return;

    midiAccess.value.inputs.forEach((input) => {
        input.removeEventListener("midimessage", onMIDIMessage);
        input.close();
    });

    midiAccess.value.outputs.forEach((output) => output.close());
    midiAccess.value = null;
};

const onClick = async () => {
    if (listening.value) {
        cleanupMIDI();
        listening.value = false;
    } else {
        try {
            midiAccess.value = await navigator.requestMIDIAccess();
            midiAccess.value.inputs.forEach((input) =>
                input.addEventListener("midimessage", onMIDIMessage)
            );
            listening.value = true;
        } catch (error) {
            alert(error);
        }
    }
};

const onMIDIMessage = (message: MIDIMessageEvent) => {
    messages.value.push(parse(message));
    if (messages.value.length > 8) messages.value.shift();
};

// Ensure cleanup when component is unmounted
onUnmounted(cleanupMIDI);
</script>


<template>
    <h1>Hello, world!</h1>

    <button @click="onClick" type="button">
        {{ buttonContent }}
    </button>

    <li v-for="message in messages">
        {{ message }}
    </li>
</template>

<style lang="css" scoped></style>