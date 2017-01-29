import tinycolor from "tinycolor2";
import { bindable, bindingMode } from "aurelia-framework";

export class ColorPicker {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public color: string;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public isOpen: boolean = false;

  private input: HTMLInputElement;
  private H: HTMLElement;
  private HSelector: HTMLElement;
  private SV: HTMLElement;
  private SVSelector: HTMLElement;
  private draggingSV: boolean = false;
  private draggingH: boolean = false;

  private SVColor: HTMLElement;
  private hsv: ColorFormats.HSV;

  private moveEvent: EventListenerOrEventListenerObject;
  private endEvent: EventListenerOrEventListenerObject;

  debounce(func: Function): void {
    let state: any = {};
    clearTimeout(state);
    state = setTimeout(
      () => func(),
      50);
  }

  public isOpenChanged(): void {
    // timeout is required as we read the clientHeight/Width and that is 0 when opening
    if (this.isOpen) {
      this.register();
    } else {
      this.unregister();
    }
    setTimeout(() => this.setColor(this.color));
  }

  public open(): void {
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

  register(): void {
    this.moveEvent = this.move.bind(this);
    this.endEvent = this.end.bind(this);
    document.addEventListener("mousemove", this.moveEvent, false);
    document.addEventListener("touchmove", this.moveEvent, false);
    document.addEventListener("touchend", this.endEvent, false);
    document.addEventListener("mouseup", this.endEvent, false);
  }

  unregister(): void {
    document.removeEventListener("mousemove", this.moveEvent, false);
    document.removeEventListener("touchmove", this.moveEvent, false);
    document.removeEventListener("touchend", this.endEvent, false);
    document.removeEventListener("mouseup", this.endEvent, false);
  }

  SVStart($event: MouseEvent | TouchEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.draggingSV = true;
    this.move($event);
  }

  HStart($event: MouseEvent | TouchEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.draggingH = true;
    this.move($event);
  }

  move($event: TouchEvent | MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    // this.debounce(() => {
    if (this.draggingSV) {
      this.calculateSV($event);
    }
    if (this.draggingH) {
      this.calculateH($event);
    }
    // });
  }

  end($event: Event): void {
    this.draggingSV = false;
    this.draggingH = false;
  }

  calculateSV($event: TouchEvent | MouseEvent): void {
    let SVWidth: number = this.SV.clientWidth;
    let SVHeight: number = this.SV.clientHeight;
    let o: Position = this.position(this.SV, $event);
    let x: number = this.edge(o.x, 0, SVWidth);
    let y: number = this.edge(o.y, 0, SVHeight);
    this.hsv.s = 1 - ((SVWidth - x) / SVWidth);
    this.hsv.v = (SVHeight - y) / SVHeight;
    this.setSVSelector(x, y);
    this.setInputValue();
  }

  calculateH($event: TouchEvent | MouseEvent): void {
    let HHeight: number = this.H.clientHeight;
    let y: number = this.edge(this.position(this.H, $event).y, 0, HHeight);
    this.hsv.h = ((HHeight - y) / HHeight);
    this.setHSelector(y);
    this.setInputValue();
  }

  setColor(color: string): void {
    if (this.SV && this.H) {
      this.hsv = tinycolor(color).toHsv();
      // need to divide by 360 as there is a bug
      let HHeight: number = this.H.clientHeight;
      let SVHeight: number = this.SV.clientHeight;
      let SVWidth: number = this.SV.clientWidth;
      let Hy: number = HHeight - (HHeight * (this.hsv.h / 360));
      let SVx: number = SVWidth - (SVWidth * (1 - this.hsv.s));
      let SVy: number = SVHeight - (SVHeight * this.hsv.v);
      this.setSVSelector(SVx, SVy);
      this.setHSelector(Hy);
      this.setInputValue();
    }
  }

  setInputValue(): void {
    this.color = tinycolor.fromRatio(this.hsv).toHexString();
    this.input.value = this.color;
  }

  setSVSelector(x: number, y: number): void {
    x = Math.round(x);
    y = Math.round(y);
    this.SVSelector.style.right = `${this.SV.clientWidth - x - (this.SVSelector.clientWidth / 2)}px`;
    this.SVSelector.style.top = `${y - (this.SVSelector.clientHeight / 2)}px`;
    this.SVSelector.style.backgroundColor = this.mostReadable(tinycolor(this.color));
  }

  setHSelector(y: number): void {
    y = Math.round(y);
    let backgroundColor: tinycolorInstance = tinycolor.fromRatio({ h: this.hsv.h, s: 1, v: 1 });
    this.SVColor.style.backgroundColor = backgroundColor.toHexString();
    this.HSelector.style.top = `${y - (this.HSelector.clientHeight / 2)}px`;
    this.HSelector.style.backgroundColor = this.mostReadable(backgroundColor);
    this.SVSelector.style.backgroundColor = this.mostReadable(tinycolor(this.color));
  }

  mostReadable(backgroundColor: tinycolorInstance): string {
    return tinycolor.mostReadable(backgroundColor, [tinycolor("black"), tinycolor("white")]).toHexString();
  }

  private position(element: Element, event: TouchEvent | MouseEvent): Position {
    let x: number = !!(<TouchEvent>event).touches ? (<TouchEvent>event).touches[0].pageX : (<MouseEvent>event).pageX;
    let y: number = !!(<TouchEvent>event).touches ? (<TouchEvent>event).touches[0].pageY : (<MouseEvent>event).pageY;
    let o: Offset = this.offset(<HTMLElement>element);
    return new Position(x - o.left, y - o.top);
  }

  private edge(current: number, start: number, end: number): number {
    if (current < start) { return start; }
    if (current > end) { return end; }
    return current;
  }

  private offset(element: HTMLElement): Offset {
    if (element === <any>window) {
      return new Offset(window.pageXOffset || document.documentElement.scrollLeft,
        window.pageYOffset || document.documentElement.scrollTop);
    } else {
      let left: number = element.offsetLeft;
      let top: number = element.offsetTop;
      while (element = <HTMLElement>element.offsetParent) {
        left += element.offsetLeft;
        top += element.offsetTop;
      }
      return new Offset(left, top);
    }
  }
}

class Offset {
  constructor(public left: number, public top: number) {

  }
}

class Position {
  constructor(public x: number, public y: number) {

  }
}
