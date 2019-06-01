import { EventEmitter } from "@angular/core";

export class Emitters {
  private constructor() {}
  private static instance: Emitters;

  updateEmitter: EventEmitter<number> = new EventEmitter<number>();
  saveEmitter: EventEmitter<string> = new EventEmitter<string>();
  zipEmitter: EventEmitter<string> = new EventEmitter<string>();
  designEmitter: EventEmitter<number> = new EventEmitter<number>();
  battleEndEmitter: EventEmitter<number> = new EventEmitter<number>();

  static getInstance(): Emitters {
    if (!Emitters.instance) Emitters.instance = new Emitters();
    return Emitters.instance;
  }
}
