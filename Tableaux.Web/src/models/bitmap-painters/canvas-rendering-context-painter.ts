import type { DrawableElement } from "../drawable-elements/drawable-element";
import { DrawableLine } from "../drawable-elements/drawable-line";
import { DrawableRectangle } from "../drawable-elements/drawable-rectangle";
import { BitmapPainter } from "./bitmap-painter";

export class CanvasRenderingContextPainter extends BitmapPainter{

    constructor(private canvas: CanvasRenderingContext2D){
        super()
    }

    public Init(width: number, height: number, translateX: number, translateY: number, zoom: number) : BitmapPainter{
        this.canvas.save();

        // Reset transform and clear the entire canvas.
        this.canvas.setTransform(1, 0, 0, 1, 0, 0);
        this.canvas.clearRect(0, 0, width, height);
        
        // Apply the current world transform.
        this.canvas.setTransform(zoom, 0, 0, zoom, translateX, translateY);

        const gridSpacing = 50;

        // Compute visible world boundaries in world coordinates.
        const worldMinX = (-translateX) / zoom;
        const worldMinY = (-translateY) / zoom;
        const worldMaxX = (width - translateX) / zoom;
        const worldMaxY = (height - translateY) / zoom;

        // Draw vertical gridlines.
        this.canvas.strokeStyle = '#ddd';
        this.canvas.lineWidth = 1 / zoom; // Keep line width consistent when zooming.
        const startX = Math.floor(worldMinX / gridSpacing) * gridSpacing;
        for (let x = startX; x < worldMaxX; x += gridSpacing) {
            this.canvas.beginPath();
            this.canvas.moveTo(x, worldMinY);
            this.canvas.lineTo(x, worldMaxY);
            this.canvas.stroke();
        }

        // Draw horizontal gridlines.
        const startY = Math.floor(worldMinY / gridSpacing) * gridSpacing;
        for (let y = startY; y < worldMaxY; y += gridSpacing) {
            this.canvas.beginPath();
            this.canvas.moveTo(worldMinX, y);
            this.canvas.lineTo(worldMaxX, y);
            this.canvas.stroke();
        }

        return this;
    }

    public DrawElement(element: DrawableElement): BitmapPainter {
        if (element instanceof DrawableLine){
            return this.DrawLine(this.canvas, element);
        }

        if (element instanceof DrawableRectangle){
            return this.DrawRectangle(this.canvas, element);
        }

        const msg = `Element ${element} not recognized as a drawable element.`
        throw new Error(msg)
    }

    public DrawRectangle(bitmap: CanvasRenderingContext2D, element: DrawableRectangle): BitmapPainter {
        bitmap.fillStyle = element.color;
        bitmap.fillRect(element.x, element.y, element.width, element.height);
        return this;
    }

    public DrawLine(bitmap: CanvasRenderingContext2D, element: DrawableLine): BitmapPainter {
        throw new Error("Method not implemented.");
    }

    public Finish(): BitmapPainter {
        this.canvas.restore();
        return this;
    }
}