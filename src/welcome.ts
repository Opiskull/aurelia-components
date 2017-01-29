import { Folder } from './models/common/folder';
import { File } from './models/common/file';
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
    let rootFolder: Folder = new Folder();
    rootFolder.name = "RootFolder";
    rootFolder.path = "/";
    let file1: File = new File();
    file1.fullName = "/file1.txt";
    file1.name = "file1.txt";
    file1.path = "/file1.txt";
    let file2: File = new File();
    file2.fullName = "/file2.txt";
    file2.name = "file2.txt";
    file2.path = "/file2.txt";
    let file3: File = new File();
    file3.fullName = "/file3.txt";
    file3.name = "file3.txt";
    file3.path = "/file3.txt";
    rootFolder.files = [file1, file2, file3];
    let folder1: Folder = new Folder();
    folder1.name = "folder1";
    let folder2: Folder = new Folder();
    folder2.name = "folder2";
    rootFolder.folders = [folder1, folder2];
    return rootFolder;
  }

  rootFolder: Folder = this.createRootFolder();


  value: string = "blue";

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
}

export class UpperValueConverter {
  toView(value: string): string {
    return value && value.toUpperCase();
  }
}
