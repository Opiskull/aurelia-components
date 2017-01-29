import { EventAggregator } from "aurelia-event-aggregator";
import { Item } from "./item";
import { autoinject, bindable } from "aurelia-framework";
import { File as FileModel } from "../../models/common/file";
@autoinject
export class File extends Item {
  @bindable public file: FileModel;
  @bindable public level: number;
  constructor(eventAggregator: EventAggregator) {
    super(eventAggregator);
  }

  public toggleSelection() {
    this.eventAggregator.publish("file.selection.changed", this.file);
  }
}
