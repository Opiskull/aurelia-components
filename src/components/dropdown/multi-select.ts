import { BindingEngine } from 'aurelia-binding';
import { BindingSignaler } from 'aurelia-templating-resources';
import { bindable, DOM, inject, computedFrom, Disposable } from 'aurelia-framework';

@inject(DOM.Element, BindingEngine, BindingSignaler)
export class MultiSelect {
  @bindable() public isOpen: boolean;
  @bindable() public selectedItems: any[] = [];
  @bindable() public items: any[] = [];
  @bindable() public removeSelected: boolean = true;
  @bindable() public filterText: string = "";
  @bindable() public filterItemsQuery: (options: { filterText: string, selectedItems: any[] }) => Promise<any[]>;
  @bindable() public debounceTimeout: number = 750;
  @bindable() public minCharacters = 2;
  @bindable() public displayItem: (item: any) => string = (item) => item;
  @bindable() public filterItem: (item: any, filterText: string) => boolean = (item, filterText) => item.includes(filterText);

  @computedFrom("filterItemsQuery")
  private get isDynamic(){
    return !!this.filterItemsQuery;
  }

  private clickEvent: EventListenerOrEventListenerObject;
  private selectedItemsChangedSubscription: Disposable;
  private filterTimeout: any;

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

  public filterTextChanged() {
    if (!this.isOpen) {
      this.isOpen = true;
    }

    this.callfilterItems();
  }

  private callfilterItems() {
    if (this.filterItemsQuery !== undefined) {
      console.log("filterChanged")

      // debounce filter      
      if (this.filterTimeout) {
        clearTimeout(this.filterTimeout);
      }
      this.filterTimeout = setTimeout(() => {
        if (this.filterText.length > this.minCharacters) {
          this.filterItemsQuery({ filterText: this.filterText, selectedItems: this.selectedItems }).then(items => this.items = items);
        } else {
          // clear result when filter is cleared
          this.items = [];
        }
      }, this.debounceTimeout);
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
      this.filterText = "";
    }
    this.isOpen = false;
  }
}
