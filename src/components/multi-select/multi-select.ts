import { BindingEngine } from 'aurelia-binding';
import { BindingSignaler } from 'aurelia-templating-resources';
import { bindable, DOM, inject, computedFrom, Disposable } from 'aurelia-framework';

@inject(DOM.Element, BindingEngine, BindingSignaler)
export class MultiSelect {
  @bindable() public isOpen: boolean;
  @bindable() public selectedItems: any[] = [];
  @bindable() public items: any[];
  @bindable() public removeSelected: boolean = true;
  @bindable() public filter: string = "";

  private clickEvent: EventListenerOrEventListenerObject;
  private selectedItemsChangedSubscription: Disposable;

  constructor(private element: Element, private bindingEngine: BindingEngine, private bindingSignaler: BindingSignaler) {
  }

  selectedItemsChanged() {
    this.detached();
    this.attached();
  }

  public attached() {
    this.selectedItemsChangedSubscription = this.bindingEngine.collectionObserver(this.selectedItems).subscribe(() => this.bindingSignaler.signal("selected-items-changed"));
  }

  public detached() {
    if (this.selectedItemsChangedSubscription) {
      this.selectedItemsChangedSubscription.dispose();
    }
  }

  public filterChanged() {
    console.log("filterTextChanged")
    if (!this.isOpen) {
      this.isOpen = true;
    }
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }

  public isOpenChanged(): void {
    if (this.isOpen) {
      this.clickEvent = this.click.bind(this);
      document.addEventListener("click", this.clickEvent, false);
    } else {
      document.removeEventListener("click", this.clickEvent, false);
    }
  }

  click($event: MouseEvent): void {
    $event.stopPropagation();
    if (!this.element.contains(<HTMLElement>$event.target)) {
      this.isOpen = false;
    }
  }

  public isSelected(item: any): boolean {
    console.log("isSelected")
    return this.selectedItems.includes(item);
  }

  public selectItem(item: any) {
    if (this.selectedItems.includes(item)) {
      let index = this.selectedItems.indexOf(item);
      if (index !== -1) {
        this.selectedItems.splice(index, 1);
      }
    } else {
      this.selectedItems.push(item);
      this.filter = "";
    }
    this.isOpen = false;
  }
}
