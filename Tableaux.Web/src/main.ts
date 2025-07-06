import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { NumberEmitter } from '@/models/graph/graph-nodes/emitters/number-emitter'
import { TextEmitter } from '@/models/graph/graph-nodes/emitters/text-emitter'
import { Logger } from '@/models/graph/graph-nodes/generic/logger'
import { Merge } from '@/models/graph/graph-nodes/generic/merge'
import { RepeatShortest } from '@/models/graph/graph-nodes/generic/repeat-shortest'
import { RepeatUntil } from '@/models/graph/graph-nodes/generic/repeat-until'
import { TrimLongest } from '@/models/graph/graph-nodes/generic/trim-longest'
import { WrapShortest } from '@/models/graph/graph-nodes/generic/wrap-shortest'
import { Add } from '@/models/graph/graph-nodes/math/add'
import { Multiply } from '@/models/graph/graph-nodes/math/square'
import { Sum } from '@/models/graph/graph-nodes/math/sum'
import { Range } from '@/models/graph/graph-nodes/math/range'
import { XY } from '@/models/graph/graph-nodes/geometry/xy'
import { Canvas } from '@/models/graph/graph-nodes/canvas/canvas'
import { Circle } from '@/models/graph/graph-nodes/canvas/circle'
import { CanvasProps } from '@/models/graph/graph-nodes/canvas/canvas-props'
import { Rectangle } from '@/models/graph/graph-nodes/canvas/rectangle'
import { Divide } from '@/models/graph/graph-nodes/math/divide'
import { SimpleRange } from '@/models/graph/graph-nodes/math/simple-range'
import { CarthesianProduct } from '@/models/graph/graph-nodes/generic/carthesian-product'
import { useGraphNodeActivatorCollection } from '@/stores/graph-node-activator-store'
import { Count } from './models/graph/graph-nodes/generic/count'
import { At } from './models/graph/graph-nodes/generic/at'
import { Filter } from './models/graph/graph-nodes/generic/filter'
import { GreaterThan } from './models/graph/graph-nodes/math/greater-than'
import { GreaterThanOrEqual } from './models/graph/graph-nodes/math/greater-than-or-equal'
import { SmallerThan } from './models/graph/graph-nodes/math/smaller-than'
import { SmallerThanOrEqual } from './models/graph/graph-nodes/math/smaller-than-or-equal'
import { Equals } from './models/graph/graph-nodes/math/equals'
import { Not } from './models/graph/graph-nodes/math/not'
import { Or } from './models/graph/graph-nodes/math/or'
import { Xor } from './models/graph/graph-nodes/math/xor'
import { And } from './models/graph/graph-nodes/math/and'
import { Any } from './models/graph/graph-nodes/math/any'
import { All } from './models/graph/graph-nodes/math/all'
import { Parse } from './models/graph/graph-nodes/json/parse'
import { Stringify } from './models/graph/graph-nodes/json/stringify'
import { Split } from './models/graph/graph-nodes/text/split'
import { NewLine } from './models/graph/graph-nodes/text/new-line'

import { logError } from '@/stores/error-log-store'

const app = createApp(App)

// catches runtime Vue errors
app.config.errorHandler = (err, vm, info) => {
  const _err = err as Error
  logError(`[Vue Error] ${_err.message} — ${info}`)
}

// catches unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logError(`[Unhandled Promise] ${event.reason}`)
})

// catches uncaught runtime JS errors
window.addEventListener('error', (event) => {
  logError(`[JS Error] ${event.message} @ ${event.filename}:${event.lineno}`)
})

app.use(router)

app.use(createPinia())

const { register } = useGraphNodeActivatorCollection()

register(['Emitters', 'Number'], (id, path) => new NumberEmitter(id, path))
register(['Emitters', 'Text'], (id, path) => new TextEmitter(id, path))

register(['Generic', 'Logger'], (id, path) => new Logger(id, path))
register(['Generic', 'Signals', 'Merge'], (id, path) => new Merge(id, path))
register(['Generic', 'Signals', 'Repeat Shortest'], (id, path) => new RepeatShortest(id, path))
register(['Generic', 'Signals', 'Trim Longest'], (id, path) => new TrimLongest(id, path))
register(['Generic', 'Signals', 'Wrap Shortest'], (id, path) => new WrapShortest(id, path))
register(['Generic', 'Signals', 'Repeat Until'], (id, path) => new RepeatUntil(id, path))
register(['Generic', 'Signals', 'Carthesian'], (id, path) => new CarthesianProduct(id, path))
register(['Generic', 'Signals', 'Count'], (id, path) => new Count(id, path))
register(['Generic', 'Signals', 'At'], (id, path) => new At(id, path))
register(['Generic', 'Signals', 'Filter'], (id, path) => new Filter(id, path))

register(['Math', 'Add'], (id, path) => new Add(id, path))
register(['Math', 'Sum'], (id, path) => new Sum(id, path))
register(['Math', 'Square'], (id, path) => new Multiply(id, path))
register(['Math', 'Divide'], (id, path) => new Divide(id, path))
register(['Math', 'Range'], (id, path) => new Range(id, path))
register(['Math', 'Range (Simple)'], (id, path) => new SimpleRange(id, path))
register(['Math', 'Greater Than'], (id, path) => new GreaterThan(id, path))
register(['Math', 'Greater Than (or equal)'], (id, path) => new GreaterThanOrEqual(id, path))
register(['Math', 'Smaller Than'], (id, path) => new SmallerThan(id, path))
register(['Math', 'Smaller Than (or equal)'], (id, path) => new SmallerThanOrEqual(id, path))
register(['Math', 'Equals'], (id, path) => new Equals(id, path))
register(['Math', 'Not'], (id, path) => new Not(id, path))
register(['Math', 'Or'], (id, path) => new Or(id, path))
register(['Math', 'Xor'], (id, path) => new Xor(id, path))
register(['Math', 'And'], (id, path) => new And(id, path))
register(['Math', 'Any'], (id, path) => new Any(id, path))
register(['Math', 'And'], (id, path) => new All(id, path))

register(['Text', 'Split'], (id, path) => new Split(id, path))
register(['Text', 'Newline'], (id, path) => new NewLine(id, path))

register(['JSON', 'Parse'], (id, path) => new Parse(id, path))
register(['JSON', 'Stringify'], (id, path) => new Stringify(id, path))

register(['Geometry', 'XY'], (id, path) => new XY(id, path))

register(['Canvas', 'Canvas'], (id, path) => new Canvas(id, path))
register(['Canvas', 'Props'], (id, path) => new CanvasProps(id, path))
register(['Canvas', 'Circle'], (id, path) => new Circle(id, path))
register(['Canvas', 'Rectangle'], (id, path) => new Rectangle(id, path))

app.mount('#app')
