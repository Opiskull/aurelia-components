import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { noView } from 'aurelia-framework';
import { Binding, BindingEngine } from 'aurelia-binding';

noView();
@autoinject()
export class NotifyBindingBehavior {
  constructor(private eventAggregator: EventAggregator, private bindingEngine: BindingEngine) {

  }

  bind(binding: Binding, scope, eventName: string) {
    console.log(binding);
    console.log(scope);



    console.log("eventName", {});
    this.eventAggregator.publish(eventName, {});
  }
  unbind(binding, scope) {
    console.log(binding);
    console.log(scope);
  }
}
