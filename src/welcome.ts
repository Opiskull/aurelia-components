//import {computedFrom} from 'aurelia-framework';

export class Welcome {
  heading: string = 'Welcome to the Aurelia Navigation App';
  firstName: string = 'John';
  lastName: string = 'Doe';
  previousValue: string = this.fullName;
  items: any[] = [
    {name:"MyItem1",id:1},
    {name:"MyItem2",id:2},
    {name:"MyItem3",id:3},
    {name:"MyItem4",id:4},
    {name:"MyItem5",id:5},
    {name:"MyItem6",id:6},
    {name:"MyItem7",id:7},
    {name:"MyItem8",id:8},
    {name:"MyItem9",id:9},
    {name:"MyItem10",id:10},
  ]

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
