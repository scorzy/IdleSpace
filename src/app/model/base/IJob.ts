export interface IJob {
  getName(): string;
  getDescription?(): string;
  getShape?(): string;
  getTotal(): Decimal;
  getProgress(): Decimal;
  getProgressPercent(): number;
  deleteFun?(): boolean;
  getTime?(): number;
  reloadTime?(): void;
}
