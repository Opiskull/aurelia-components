import { EventAggregator } from "aurelia-event-aggregator";
import { Item } from "./item";
import { autoinject, bindable } from "aurelia-framework";
import { Folder as FolderModel } from "../../models/common/folder";
@autoinject
export class Folder extends Item {
  @bindable public folder: FolderModel;
  @bindable public level: number;
  constructor(eventAggregator: EventAggregator) {
    super(eventAggregator);
  }

  private collapsed: boolean = true;

  public toggleExpand() {
    this.collapsed = !this.collapsed;
  }
}
