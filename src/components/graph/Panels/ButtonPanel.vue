<template>
  <ButtonEmitter :graph-node="graphNode" />
</template>

<script setup lang="ts">
import type { Toggle } from '@/graph/graph-nodes/generic/toggle'
import ButtonEmitter from '@/components/emitters/ButtonEmitter.vue'

defineProps<{
  graphNode: Toggle
}>()
</script>
