import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { type XY } from '@/geometry/xy'
import { assertIsTransformationMatrix } from '@/geometry/transformation-matrix'
import { decomposeMatrix } from '@/geometry/decomposed-transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Decompose')
export class Decompose extends GraphNode {
  private input

  private outputTranslation
  private outputRotation
  private outputScale
  private outputSkew

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput('Transformation Matrix')

    this.outputTranslation = this.registerObjectOutput<XY>('Translation')
    this.outputRotation = this.registerNumberOutput('Rotation')
    this.outputScale = this.registerObjectOutput<XY>('Scale')
    this.outputSkew = this.registerObjectOutput<XY>('Skew')
  }

  protected async solve(): Promise<void> {
    inputIterators.cycleValues(this.input).forEach(([_geom]) => {
      const matrix = assertIsTransformationMatrix(_geom)
      const { translation, rotation, scale, skew } = decomposeMatrix(matrix)

      this.outputTranslation.next(translation)
      this.outputRotation.next(rotation)
      this.outputScale.next(scale)
      this.outputSkew.next(skew)
    })
  }
}
