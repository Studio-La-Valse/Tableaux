<template>
  <div class="default-emitter">
  {{ graphNode.path.at(-1) }}
  </div>
</template>

<script setup lang="ts">
import type { GraphNode } from '@/models/graph/core/graph-node';
import { onMounted } from 'vue';

defineProps({
  graphNode: {
    type: Object as () => GraphNode,
    required: true,
  }
})

onMounted(() => {

})

</script>
