export class DisplayValueValueConverter {
  toView(item: any, displayItem: (item:any) => string) {
    if(item === undefined){
      return "";
    }
    return displayItem(item);
  }
}
