import { BindingEngine } from "aurelia-binding";
import { BindingSignaler } from "aurelia-templating-resources";
import { bindable, DOM, inject, computedFrom, Disposable, observable } from "aurelia-framework";

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
  private get isDynamic() {
    return !!this.filterItemsQuery;
  }

  @observable() public filteredItems: any[] = [];

  private clickToCloseEvent: EventListenerOrEventListenerObject;
  private selectedItemsChangedSubscription: Disposable;
  private filterTimeout: any;
  private keyboardSelected: number = -1;

  constructor(private element: Element, private bindingEngine: BindingEngine, private bindingSignaler: BindingSignaler) {
  }

  selectedItemsChanged() {
    this.detached();
    this.attached();
  }

  public attached() {
    if (this.selectedItems) {
      this.selectedItemsChangedSubscription = this.bindingEngine.collectionObserver(this.selectedItems)
        .subscribe(() => this.bindingSignaler.signal("selected-items-changed"));
    }
  }

  public detached() {
    if (this.selectedItemsChangedSubscription) {
      this.selectedItemsChangedSubscription.dispose();
    }
  }

  private scrollIntoView() {
    setTimeout(() => {
      let keyboard = this.element.querySelector(".keyboard");
      if (keyboard !== null) {
        keyboard.scrollIntoView();
      }
    });
  }

  public filterTextKeyDown($event: KeyboardEvent) {
    // Backspace
    if ($event.keyCode === 8 && this.filterText === "") {
      this.selectedItems.pop();
    }
    // ESC
    if ($event.keyCode === 27) {
      this.isOpen = false;
      this.keyboardSelected = -1;
    }
    // Enter
    if ($event.keyCode === 13) {
      if (this.keyboardSelected !== -1) {
        this.selectItem(this.filteredItems[this.keyboardSelected]);
      }
      this.keyboardSelected = -1;
    }
    // down
    if ($event.keyCode === 40) {
      if (this.keyboardSelected !== -1) {
        if (this.keyboardSelected >= (this.filteredItems.length - 1)) {
          this.keyboardSelected = 0;
        } else {
          this.keyboardSelected++;
        }
      } else {
        this.keyboardSelected = 0;
      }
      this.scrollIntoView();
      return false;
    }
    // up
    if ($event.keyCode === 38) {
      if (this.keyboardSelected !== -1) {
        if (this.keyboardSelected <= 0) {
          this.keyboardSelected = this.filteredItems.length - 1;
        } else {
          this.keyboardSelected--;
        }
      } else {
        this.keyboardSelected = this.filteredItems.length - 1;
      }
      this.scrollIntoView();
      return false;
    }
    return true;
  }

  public filterTextChanged() {
    if (!this.isOpen) {
      this.isOpen = true;
    }
    this.callfilterItems();
  }

  private callfilterItems() {
    if (this.filterItemsQuery !== undefined) {
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
      this.clickToCloseEvent = this.clickToClose.bind(this);
      document.addEventListener("click", this.clickToCloseEvent, false);
    } else {
      document.removeEventListener("click", this.clickToCloseEvent, false);
    }
  }

  clickToClose($event: MouseEvent): void {
    $event.stopPropagation();
    if (!this.element.contains(<HTMLElement>$event.target)) {
      this.isOpen = false;
    }
  }

  public isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }

  public selectItem(item: any) {
    let selectedItems = this.selectedItems.map((selectedItem) => typeof (selectedItem) === "object" ? JSON.stringify(selectedItem) : selectedItem);
    let selectedItem = typeof (item) === "object" ? JSON.stringify(item) : item;
    if (selectedItems.includes(selectedItem)) {
      let index = selectedItems.findIndex(item => selectedItem === item);
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
