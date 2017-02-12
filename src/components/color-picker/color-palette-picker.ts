import * as tinycolor from "tinycolor2";
import { bindable, bindingMode, inject, DOM } from "aurelia-framework";

import "./color-picker.scss"

@inject(DOM.Element)
export class ColorPalettePicker {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public color: string;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public isOpen: boolean = false;
  @bindable() public columns: number = 5;
  @bindable() public colors: string[];
  public rows: string[][];

  constructor(private element: Element) {

  }

  private input: HTMLInputElement;
  private clickEvent: EventListenerOrEventListenerObject;

  public isOpenChanged(): void {
    // timeout is required as we read the clientHeight/Width and that is 0 when opening
    if (this.isOpen) {
      this.attachEvents();
    } else {
      this.detachEvents();
    }
    setTimeout(() => this.setColor(this.color));
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }

  public attached(): void {
    this.setColor(this.color);
  }

  onEnter($event: KeyboardEvent): boolean {
    if ($event.keyCode === 13) {
      this.setColor(this.input.value);
    }
    return true;
  }

  onBlur($event: KeyboardEvent): void {
    this.setColor(this.input.value);
  }

  attachEvents(): void {
    this.clickEvent = this.click.bind(this);
    document.addEventListener("click", this.clickEvent, false);
  }

  detachEvents(): void {
    document.removeEventListener("click", this.clickEvent, false);
  }

  click($event: MouseEvent): void {
    $event.stopPropagation();
    if (!this.element.contains(<HTMLElement>$event.target)) {
      this.isOpen = false;
    }
  }

  colorsChanged() {
    this.rows = this.createRows(this.colors);
  }

  createRows(colors: string[]) {
    let i = 0;
    let j = 0;
    let rows = [];
    for (let i = 0, j = colors.length; i < j; i += this.columns) {
      rows.push(colors.slice(i, i + this.columns));
    }
    return rows;
  }

  setColor(color: string): void {
    this.color = tinycolor(color).toHexString();
    this.input.value = this.color;
  }

  selectColor(color: string): void {
    this.setColor(color);
    this.isOpen = false;
  }
}
