export * from './single-select';
export * from './multi-select';
export * from './filter-value-converter';
export * from './filtered-items-value-converter';
export * from './display-value-value-converter';
export * from './remove-selected-items-value-converter';


export function clickToClose(component: any) {
  component.clickToClose = ($event: MouseEvent): void => {
    $event.stopPropagation();
    if (!component.element.contains(<HTMLElement>$event.target)) {
      component.isOpen = false;
    }
  }
}

export function isOpenChanged(component: any) {
  if (component.isOpen) {
    component.clickToCloseEvent = component.clickToClose;
    document.addEventListener("click", component.clickToCloseEvent, false);
  } else {
    document.removeEventListener("click", component.clickToCloseEvent, false);
  }
}

