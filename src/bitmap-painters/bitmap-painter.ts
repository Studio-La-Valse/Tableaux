import { type BaseShape, type Shape } from '@/geometry/shape';
import { type ArcShape } from '../geometry/arc';
import { formatCSSRGBA } from '../geometry/color-rgb';
import { type EllipticalArcShape } from '../geometry/elliptical-arc';
import { type PolylineShape } from '../geometry/polyline';
import { type RectangleShape } from '../geometry/rectangle';
import { type TextShape } from '@/geometry/text';
import { formatCtx } from '@/geometry/font';
import { formatCtxFilter } from '../geometry/filter';
import type { CircleShape } from '@/geometry/circle';
import type { EllipseShape } from '@/geometry/ellipse';
import type { CubicShape } from '@/geometry/cubic';
import type { QuadraticShape } from '@/geometry/quadratic';
import type { ClearRectShape } from '@/geometry/clear-rect';

const DEFAULT_MATRIX = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

export function init(
  canvasRef: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D {
  // Ensure the canvas matches the intended drawing surface
  canvasRef.width = width;
  canvasRef.height = height;

  const ctx = canvasRef.getContext('2d');
  if (!ctx) {
    throw new Error('A 2d context could not be created from an HTML Canvas Element.');
  }

  ctx.imageSmoothingEnabled = false;
  const { a, b, c, d, e, f } = DEFAULT_MATRIX;
  ctx.setTransform(a, b, c, d, e, f);

  return ctx;
}

export function clear(ctx: CanvasRenderingContext2D) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.clearRect(0, 0, width, height);
}

export function draw(ctx: CanvasRenderingContext2D, element: Shape) {
  switch (element.kind) {
    case 'clear-rect':
      clearRect(ctx, element);
      return;
    case 'polyline':
      drawPolyline(ctx, element);
      return;
    case 'circle':
    case 'arc':
      drawArc(ctx, element);
      return;
    case 'ellipse':
    case 'elliptical-arc':
      drawEllipse(ctx, element);
      return;
    case 'rectangle':
      drawRectangle(ctx, element);
      return;
    case 'text':
      drawText(ctx, element);
      return;
    case 'cubic':
      drawCubic(ctx, element);
      return;
    case 'quadratic':
      drawQuadratic(ctx, element);
      return;
  }
}

// --- shared helpers ---

function setTransform(ctx: CanvasRenderingContext2D, element: BaseShape) {
  const { a, b, c, d, e, f } = element.t ?? DEFAULT_MATRIX;
  ctx.setTransform(a, b, c, d, e, f);
}

function setFilter(ctx: CanvasRenderingContext2D, element: BaseShape) {
  ctx.filter = formatCtxFilter(element);
}

function setTextFormat(ctx: CanvasRenderingContext2D, element: TextShape) {
  const { fontFamily, fontSize, align, baseline, direction } = element;

  ctx.font = formatCtx(fontFamily, fontSize);
  ctx.textAlign = align ?? 'left';
  ctx.textBaseline = baseline ?? 'alphabetic';
  ctx.direction = direction ?? 'inherit';
}

function applyFill(ctx: CanvasRenderingContext2D, element: BaseShape) {
  const { fill } = element;
  if (!fill) return;

  ctx.fillStyle = formatCSSRGBA(fill);
  ctx.fill();
}

function applyStroke(ctx: CanvasRenderingContext2D, element: BaseShape) {
  const { stroke, strokeWidth } = element;
  if (!stroke || !strokeWidth) return;

  ctx.strokeStyle = formatCSSRGBA(stroke);
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}

function drawShape<T extends BaseShape>(
  ctx: CanvasRenderingContext2D,
  element: T,
  _drawShape: () => void
) {
  ctx.save();

  setTransform(ctx, element);
  setFilter(ctx, element);

  ctx.beginPath();
  _drawShape();

  applyFill(ctx, element);
  applyStroke(ctx, element);

  ctx.restore();
}

// --- shapes ---

function drawPolyline(ctx: CanvasRenderingContext2D, element: PolylineShape) {
  drawShape(ctx, element, () => {
    const { start, end, points } = element;
    ctx.moveTo(start.x, start.y);
    for (const p of points) {
      ctx.lineTo(p.x, p.y);
    }
    ctx.lineTo(end.x, end.y);
  });
}

function drawArc(ctx: CanvasRenderingContext2D, element: ArcShape | CircleShape) {
  drawShape(ctx, element, () => {
    const { x, y, radius } = element;
    const startAngle = (element as ArcShape).startAngle ?? 0;
    const endAngle = (element as ArcShape).endAngle ?? Math.PI * 2;
    const counterclockwise = (element as ArcShape).counterclockwise ?? false;

    ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
  });
}

function drawEllipse(ctx: CanvasRenderingContext2D, element: EllipticalArcShape | EllipseShape) {
  drawShape(ctx, element, () => {
    const { x, y, radiusX, radiusY, rotation } = element;
    const startAngle = (element as EllipticalArcShape).startAngle ?? 0;
    const endAngle = (element as EllipticalArcShape).endAngle ?? Math.PI * 2;
    const counterclockwise = (element as EllipticalArcShape).counterclockwise ?? false;

    ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
  });
}

function drawRectangle(ctx: CanvasRenderingContext2D, element: RectangleShape) {
  drawShape(ctx, element, () => {
    const { x, y, width, height, radii } = element;
    if (radii) {
      ctx.roundRect(x, y, width, height, radii);
    } else {
      ctx.rect(x, y, width, height);
    }
  });
}

function drawText(ctx: CanvasRenderingContext2D, element: TextShape) {
  ctx.save();
  setTransform(ctx, element);
  setFilter(ctx, element);
  setTextFormat(ctx, element);

  const { x, y, text, stroke, strokeWidth, fill } = element;

  if (stroke && strokeWidth) {
    ctx.strokeStyle = formatCSSRGBA(stroke);
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(text, x, y);
  }
  if (fill) {
    ctx.fillStyle = formatCSSRGBA(fill);
    ctx.fillText(text, x, y);
  }

  ctx.restore();
}

function drawCubic(ctx: CanvasRenderingContext2D, element: CubicShape) {
  drawShape(ctx, element, () => {
    const { start, control1, control2, end } = element;
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y);
  });
}

function drawQuadratic(ctx: CanvasRenderingContext2D, element: QuadraticShape) {
  drawShape(ctx, element, () => {
    const { start, control, end } = element;
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
  });
}

// --- clear rect ---

export function clearRect(ctx: CanvasRenderingContext2D, element: ClearRectShape) {
  drawShape(ctx, element, () => {
    const { x, y, width, height } = element;
    ctx.clearRect(x, y, width, height);
  });
}
