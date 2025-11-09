import type { JsonValue } from '@/graph/core/models/json-value';
import { GraphNodeType } from '../decorators';
import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { nanoid } from 'nanoid';
import { deleteStore, initialize, read, type Store } from './store';

@GraphNodeType('Generic', 'Store', 'Reader')
export class StoreReader extends GraphNode {
  private initial;
  private reset;
  private name;
  private values;

  public override data: {
    name: string;
  };

  constructor(modelId: string) {
    super(modelId);
    this.initial = this.registerUnknownInput('Initial');
    this.reset = this.registerBooleanInput('Reset');
    this.registerUnknownInput('Trigger'); // ensures dependency

    this.name = this.registerStringOutput('Name');
    this.values = this.registerUnknownOutput('Values');
    this.data = { name: nanoid(11) };
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    const [reset] = iterators.singletonOnly(this.reset);

    const name = this.data.name;
    let store: Store;
    if (reset) {
      const initialData: JsonValue[] = [];
      for await (const value of iterators.createGenerator(this.initial)) {
        initialData.push(value);
      }
      store = initialize(name, initialData);
    } else {
      store = read(name);
    }

    for (const value of store.data) {
      this.values.next(value);
    }

    this.name.next(this.data.name);
  }

  override onDestroy(): void {
    deleteStore(this.data.name);
  }
}
