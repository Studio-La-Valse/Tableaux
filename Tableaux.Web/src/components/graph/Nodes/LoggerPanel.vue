<template>
  <p>{{ value?.join(", ") }}</p>
</template>

<script setup lang="ts">
import type { Logger } from '@/models/graph/graph-nodes/generic/logger';
import { computed, onMounted } from 'vue';


const props = defineProps({
  graphNode: {
    type: Object as () => Logger,
    required: true,
  }
});

const value = computed(() => props.graphNode.values.value);

onMounted(() => {
  props.graphNode.onInitialize();
})

</script>
