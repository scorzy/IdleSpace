import { EventEmitter } from "@angular/core";

export class Emitters {
  updateEmitter: EventEmitter<number> = new EventEmitter<number>();
  saveEmitter: EventEmitter<string> = new EventEmitter<string>();
  zipEmitter: EventEmitter<string> = new EventEmitter<string>();
  designEmitter: EventEmitter<number> = new EventEmitter<number>();
  battleEndEmitter: EventEmitter<number> = new EventEmitter<number>();
}
