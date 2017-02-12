export class FilterValueConverter{
  toView(items: any[], filterText: string, filterFunction: (item:any,filterText:string) => boolean){
    if(filterText === ""){
      return items;
    }
    return items.filter((item) => filterFunction(item,filterText));
  }
}
