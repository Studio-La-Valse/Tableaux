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

const app = createApp(App)

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

register(['Geometry', 'XY'], (id, path) => new XY(id, path))

register(['Canvas', 'Canvas'], (id, path) => new Canvas(id, path))
register(['Canvas', 'Props'], (id, path) => new CanvasProps(id, path))
register(['Canvas', 'Circle'], (id, path) => new Circle(id, path))
register(['Canvas', 'Rectangle'], (id, path) => new Rectangle(id, path))

app.mount('#app')
