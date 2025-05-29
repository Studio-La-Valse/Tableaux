<template>
  <div class="controller">
    <p v-if="latestNote">Received MIDI Note: {{ latestNote }}</p>
    <button @click="toggleListening">{{ buttonLabel }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { MidiListenerService } from "@/services/midi-listener-service";
import { MidiMessage, parse } from "@/models/midi-message";

const midiService = new MidiListenerService();
const listening = ref(false);
const buttonLabel = ref("Start Listening");
const latestNote = ref<MidiMessage | null>(null);

const onMIDIMessage = (message: MIDIMessageEvent) => {
    const parsedMessage = parse(message);
    latestNote.value = parsedMessage; // Extract MIDI note
};

const toggleListening = async () => {
  if (listening.value) {
    midiService.stopListening();
    latestNote.value = null;
    listening.value = false;
    buttonLabel.value = "Start Listening";
  } else {
    await midiService.initMIDI();
    midiService.startListening(onMIDIMessage);
    listening.value = true;
    buttonLabel.value = "Stop Listening";
  }
};

onMounted(async () => await midiService.initMIDI());
onUnmounted(() => midiService.cleanup());
</script>

<style scoped>
.controller {
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 8px;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
}
</style>
