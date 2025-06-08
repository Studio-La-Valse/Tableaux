<script lang="ts">
import { LGraphNode } from "litegraph.js"

import { useDispatcherStore } from "@/stores/element-dispatcher-store";
import { DrawableRectangle } from '@/models/drawable-elements/drawable-rectangle';

export class DrawableRectangleNode extends LGraphNode {

  private dispatcherStore;

  constructor() {
    super("Draw Circle");

    this.addInput("radius", "number")
    this.addInput("x", "number")
    this.addInput("y", "number")
    this.addInput("color", "string")

    this.dispatcherStore = useDispatcherStore();
  }

  override onAdded(): void {
    this.dispatcherStore.registerEmitter(this.id.toString());
  }

  override onExecute(): void {
    const x = this.getInputData(1) ?? 0
    const y = this.getInputData(2) ?? 0
    const color = this.getInputData(3)
    const element = new DrawableRectangle(x, y, 100, 100, color)

    this.dispatcherStore.queueElement(element);
    this.dispatcherStore.markEmitterComplete(this.id.toString());
  }

  override onRemoved(): void {
    this.dispatcherStore.unregisterEmitter(this.id.toString());
  }
}

</script>
