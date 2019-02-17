import { EventEmitter } from "@angular/core";

export class Emitters {
  updateEmitter: EventEmitter<number> = new EventEmitter<number>();
  saveEmitter: EventEmitter<string> = new EventEmitter<string>();
  zipEmitter: EventEmitter<string> = new EventEmitter<string>();
}
