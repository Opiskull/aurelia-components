import { Folder } from './../../models/common/folder';
import { File as FileModel } from './../../models/common/file';
import { bindable, autoinject, bindingMode, computedFrom } from 'aurelia-framework';
import { Logger, getLogger } from 'aurelia-logging';
@autoinject
export class ImageView {
  @bindable root: Folder;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedFile: FileModel;
  @bindable onUploadFile: (arrayBuffer: ArrayBuffer) => void;

  private log: Logger = getLogger(this.constructor.name);

  constructor() {
  }

  private file: HTMLInputElement;
  private fileName: string = '';

  private isFileSelected(): boolean {
    return this.fileName !== "";
  }

  private fileChanged($event: Event) {
    if (this.file && this.file.value) {
      if (this.file.value.indexOf("/") !== -1) {
        let parts = this.file.value.split("/");
        this.fileName = parts[parts.length - 1];
      } else {
        let parts = this.file.value.split("\\");
        this.fileName = parts[parts.length - 1];
      }
    }
  }

  private startFileUpload() {
    if (this.file.files && this.file.files.length == 1) {
      let fileReader = new FileReader();
      let file: File = this.file.files[0];
      fileReader.onload = (e: Event) => {
        if (this.onUploadFile !== undefined) {
          this.onUploadFile(fileReader.result);
        }
      }
      fileReader.onerror = (e: Event) => {
        this.log.error("Upload Failed", fileReader.error);
      }
      fileReader.readAsArrayBuffer(file);
    }
  }
}
