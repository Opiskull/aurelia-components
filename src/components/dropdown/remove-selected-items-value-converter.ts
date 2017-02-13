export class RemoveSelectedItemsValueConverter {
  toView(items: any[], selectedItems: any[] = [], removeSelected: boolean = false) {
    if (removeSelected && selectedItems.length > 0) {
      let selectedItemsFilter = selectedItems.map((item) => typeof (item) === "object" ? JSON.stringify(item) : item);
      return items.filter(item => !selectedItemsFilter.includes(typeof (item) === "object" ? JSON.stringify(item) : item));
    } else {
      return items;
    }
  }
}
