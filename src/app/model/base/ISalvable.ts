export interface ISalvable {
  getSave(): any;
  load(data: any): boolean;
}
