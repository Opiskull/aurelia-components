import { Item } from './item';
import { EventAggregator } from 'aurelia-event-aggregator';
import { File } from './file';
import { Folder } from "./../../models/common/folder";
import { autoinject, bindable } from "aurelia-framework";
@autoinject
export class FolderView {
  @bindable selectedPath: string = "";
  @bindable selectedFile: File;
  @bindable root: Folder;

  constructor(private eventAggregator: EventAggregator) {
    this.eventAggregator.subscribe("file.selection.changed", (file: File) => {
      this.selectedFile = file;
    });
  }
}
