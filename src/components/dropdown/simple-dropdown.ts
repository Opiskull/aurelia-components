import { inject, bindable, DOM } from 'aurelia-framework';

@inject(DOM.Element)
export class SimpleDropdown {
  @bindable() isOpen: boolean = false;
  @bindable() selectedItem: any;
  @bindable() items: any[];

  private clickEvent: EventListenerOrEventListenerObject;

  constructor(private element: Element) {

  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: any) {
    this.selectedItem = item;
    this.isOpen = false;
  }

  click($event: MouseEvent): void {
    $event.stopPropagation();
    if (!this.element.contains(<HTMLElement>$event.target)) {
      this.isOpen = false;
    }
  }

  public isOpenChanged(): void {
    if (this.isOpen) {
      this.clickEvent = this.click.bind(this);
      document.addEventListener("click", this.clickEvent, false);
    } else {
      document.removeEventListener("click", this.clickEvent, false);
    }
  }
}
