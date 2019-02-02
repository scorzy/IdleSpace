import { Injectable, HostBinding } from "@angular/core";
import { createWorker, ITypedWorker } from "typed-web-workers";
import { Game } from "./model/game";
import { Emitters } from "./emitters";
declare let LZString: any;

const UP_INTERVAL = 250; // 4 fps

@Injectable({
  providedIn: "root"
})
export class MainService {
  zipWorker: ITypedWorker<CompressRequest, CompressRequest>;
  game: Game;
  show = false;
  lastUnitUrl = "/home/res/m";
  last: number;
  em = new Emitters();

  constructor() {
    this.zipWorker = createWorker({
      workerFunction: this.comp,
      onMessage: this.onZip,
      onError: error => {},
      importScripts: [
        document.location.protocol +
          "//" +
          document.location.host +
          "/lz-string.min.js"
      ]
    });
  }
  start() {
    this.game = new Game();
    this.show = true;
    setInterval(this.update.bind(this), UP_INTERVAL);
  }

  update() {
    const now = Date.now();
    const diff = (now - this.last) / 1000;
    this.game.update(diff);
    this.last = now;
    this.em.updateEmitter.emit(diff);
  }

  comp(input: CompressRequest, cb: (_: CompressRequest) => void): void {
    if (input.compress) {
      let save = "";
      try {
        save = LZString.compressToBase64(JSON.stringify(input));
      } catch (ex) {
        save = "";
      }
      cb(new CompressRequest(null, save, input.compress, input.requestId));
    } else {
      let obj: any = null;
      try {
        obj = JSON.parse(LZString.decompressFromBase64(input.obj));
      } catch (ex) {
        obj = "";
      }
      cb(new CompressRequest(obj, null, input.compress, input.requestId));
    }
  }

  onZip(result: CompressRequest): void {
    if (result.compress) {
      if (result.zipped !== "") {
        localStorage.setItem("save", result.zipped);
        localStorage.setItem("saveDate", Date());
        console.log(result);
      } else {
        console.log("Error");
      }
    } else {
      if (result.obj != null) {
        this.game = new Game();
        this.game.load(result.obj);
      } else {
        console.log("Error");
      }
    }
  }
}

// tslint:disable-next-line:class-name
// tslint:disable-next-line:max-classes-per-file
class CompressRequest {
  constructor(
    public obj: any,
    public zipped: string,
    public compress: boolean,
    public requestId: number
  ) {}
}
