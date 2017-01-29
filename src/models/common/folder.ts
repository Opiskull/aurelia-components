import { File } from "./File";

export class Folder {
  public path: string;
  public name: string;
  public files?: File[];
  public folders?: Folder[];

  constructor() {
    this.files = [];
    this.folders = [];
  }
}

