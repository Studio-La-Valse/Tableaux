<template>
  <svg class="canvas" width="400" height="400" viewBox="0 0 400 400">
    <circle v-for="(note, index) in notes" :key="index"
      :cx="index * 50 + 50" cy="200" r="20" fill="blue" />
  </svg>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { MidiListenerService } from "@/services/midi-listener-service";
import { MidiMessage, parse } from "@/models/midi-message";

const midiService = new MidiListenerService();
const notes = ref<MidiMessage[]>([]);

const onMIDIMessage = (message: MIDIMessageEvent) => {
  const parsedMessage = parse(message)
  notes.value.push(parsedMessage);
  if (notes.value.length > 8) notes.value.shift();
};

onMounted(async () => {
  await midiService.initMIDI();
  midiService.startListening(onMIDIMessage);
});

onUnmounted(() => {
  midiService.stopListening();
  midiService.cleanup();
});
</script>

<style scoped>
.canvas {
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
