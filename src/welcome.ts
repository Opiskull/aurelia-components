import { Folder } from './models/common/folder';
import { File } from './models/common/file';
import * as tinycolor from "tinycolor2";
//import {computedFrom} from 'aurelia-framework';

export class Welcome {
  heading: string = 'Welcome to the Aurelia Navigation App';
  firstName: string = 'John';
  lastName: string = 'Doe';
  previousValue: string = this.fullName;
  items: any[] = [
    { name: "MyItem1", id: 1 },
    { name: "MyItem2", id: 2 },
    { name: "MyItem3", id: 3 },
    { name: "MyItem4", id: 4 },
    { name: "MyItem5", id: 5 },
    { name: "MyItem6", id: 6 },
    { name: "MyItem7", id: 7 },
    { name: "MyItem8", id: 8 },
    { name: "MyItem9", id: 9 },
    { name: "MyItem10", id: 10 },
  ]

  public createRootFolder(): Folder {
    let rootFolder: Folder = {
      name: "RootFolder", path: "/"
    }

    let file1: File = {
      fullName: "/file1.txt",
      name: "file1.txt",
      path: "/file1.txt"
    }
    let file2: File = {
      fullName: "/file2.txt",
      name: "file2.txt",
      path: "/file2.txt"
    }
    let file3: File = {
      fullName: "/folder1/file3.txt",
      name: "file3.txt",
      path: "/folder1/file3.txt"
    }
    let file4: File = {
      fullName: "/folder1/file4.txt",
      name: "file4.txt",
      path: "/folder1/file4.txt"
    }
    rootFolder.files = [file1, file2];
    let folder1: Folder = {
      name: "folder1",
      path: "/folder1",
      files: []
    }
    let folder2: Folder = {
      name: "folder2",
      path: "/folder2",
      files: []
    }
    rootFolder.folders = [folder1, folder2];
    folder1.files = [file3,file4];
    return rootFolder;
  }

  private colors = ["red","green","blue","black","#444444","#123123","#333111"];
  private selectedItems = [];

  rootFolder: Folder = this.createRootFolder();


  value: string = "blue";

  uploadFile(arrayBuffer: ArrayBuffer){
    console.log("uploadFile");
  }

  //Getters can't be directly observed, so they must be dirty checked.
  //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
  //To optimize by declaring the properties that this getter is computed from, uncomment the line below
  //as well as the corresponding import above.
  //@computedFrom('firstName', 'lastName')
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  submit() {
    this.previousValue = this.fullName;
    alert(`Welcome, ${this.fullName}!`);
  }

  canDeactivate(): boolean | undefined {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }

  private bla:any = {
  }
}

export class UpperValueConverter {
  toView(value: string): string {
    return value && value.toUpperCase();
  }
}
