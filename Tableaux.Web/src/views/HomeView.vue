<template>
  <div id="split-horizontal">
    <MidiControls class="controls" />
    <div id="split-vertical">
      <DesignCanvas class="canvas" :elements="drawableElements"/>

      <GraphCanvas class="canvas">
        <rect width="100" height="100" x="100" y="100" fill="red"/>
      </GraphCanvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import MidiControls from "@/components/MidiController.vue";
import GraphCanvas from "@/components/GraphCanvas.vue";
import DesignCanvas, { type Drawable } from "@/components/DesignCanvas.vue";
import Split from "split.js";
import { onMounted, ref } from "vue";

class Rectangle implements Drawable {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string = 'red'
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Reactive list of drawable elements.
const drawableElements = ref<Drawable[]>([
  new Rectangle(50, 50, 100, 100, 'blue'),
  new Rectangle(200, 150, 150, 80, 'green'),
]);


onMounted(() => {
  // Split MidiControls and canvas-container horizontally
  Split([".controls", "#split-vertical"], {
    direction: "horizontal",
    sizes: [20, 75],
    minSize: [150, 300], // MidiControls min-width, Canvas area min-width
    gutterSize: 6,
  });

  // Split canvases vertically
  Split([".canvas:first-child", ".canvas:last-child"], {
    direction: "vertical",
    sizes: [50, 50],
    gutterSize: 6,
    minSize: 100, // Minimum height for each canvas
  });
});
</script>


<style lang="css" scoped>
#split-horizontal {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.controls {
  flex-grow: 1; /* Allows resizing */
  min-width: 150px; /* Prevents shrinking too much */
  padding: 1rem;
  background: #2c3e50;
  color: white;
}

#split-vertical {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100vh;
}

.canvas {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

</style>