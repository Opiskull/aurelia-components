import { computedFrom } from 'aurelia-framework';
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import {BindingSignaler} from "aurelia-binding";
export class Item {
  protected subscription: Subscription;

  constructor(protected eventAggregator: EventAggregator) {
    let bindingSignaler: BindingSignaler;

  }

  public attached() {
    this.subscription = this.eventAggregator.subscribe("file.selection.changed", (item: Item) => {
      if (this === item) {
        this.selected = true;
      } else {
        this.selected = false;
      }
    });
  }

  public detached() {
    this.subscription.dispose();
  }

  public selected: boolean;
  public paddingLeft(): number {
    return (this.level + 1) * 10;
  }
  public level: number;
}
