import { Injectable } from "@angular/core";
import { createWorker, ITypedWorker } from "typed-web-workers";
import { Game } from "./model/game";
import { Emitters } from "./emitters";

declare let LZString: any;

const UP_INTERVAL = 200; // 5 fps

@Injectable({
  providedIn: "root"
})
export class MainService {
  zipWorker: ITypedWorker<CompressRequest, CompressRequest2>;
  game: Game;
  show = false;
  lastUnitUrl = "/home/res/m";
  last: number;
  em = new Emitters();
  kongregate = false;
  playFabLogged = false;

  constructor() {
    const url = document.location.protocol + "//" + document.location.host + "/";
    this.zipWorker = createWorker({
      workerFunction: this.comp,
      onMessage: this.onZip.bind(this),
      onError: error => {},
      importScripts: [
        url + "lz-string.min.js",
        url + "assets/compressRequest2.js"
      ]
    });
  }
  start() {
    const savedData = localStorage.getItem("save");
    if (savedData) {
      this.load(savedData);
    } else {
      this.game = new Game();
      this.show = true;
    }
    setInterval(this.update.bind(this), UP_INTERVAL);
  }

  update() {
    if (!this.game) return false;

    const now = Date.now();
    const diff = (now - this.last) / 1000;
    this.game.update(diff);
    this.last = now;
    this.em.updateEmitter.emit(diff);
  }
  reload() {
    this.game.reload();
    this.em.updateEmitter.emit(0);
  }
  getSave(): any {
    const data: any = {};
    data.g = this.game.save();
    data.l = this.last;
    return data;
  }
  load(data?: any): any {
    this.zipWorker.postMessage(
      new CompressRequest(localStorage.getItem("save"), "", false, 2)
    );
  }
  load2(data: any): any {
    this.last = data.l;
    this.game = new Game();
    this.game.load(data.g);
    this.show = true;
  }
  import(str: string) {
    this.zipWorker.postMessage(new CompressRequest(str, "", false, 2));
  }

  export() {
    this.zipWorker.postMessage(new CompressRequest(this.getSave(), "", true, 1));
  }
  save() {
    this.zipWorker.postMessage(new CompressRequest(this.getSave(), "", true, 0));
  }
  clear() {
    localStorage.removeItem("save");
    window.location.reload();
  }

  comp(input: CompressRequest, cb: (_: CompressRequest2) => void): void {
    if (input.compress) {
      let save = "";
      try {
        save = LZString.compressToBase64(JSON.stringify(input.obj));
      } catch (ex) {
        save = "";
      }
      cb(new CompressRequest2(null, save, input.compress, input.requestId));
    } else {
      let obj: any = null;
      try {
        obj = JSON.parse(LZString.decompressFromBase64(input.obj));
      } catch (ex) {
        obj = "";
      }
      cb(new CompressRequest2(obj, null, input.compress, input.requestId));
    }
  }

  onZip(result: CompressRequest): void {
    if (result.compress) {
      if (result.zipped !== "") {
        if (result.requestId === 0) {
          localStorage.setItem("save", result.zipped);
          localStorage.setItem("saveDate", Date());
        } else if (result.requestId === 1) {
          this.em.zipEmitter.emit(result.zipped);
        }
        // console.log(result);
      } else {
        console.log("Error");
      }
    } else {
      if (result.obj != null) {
        this.load2(result.obj);
      } else {
        console.log("Error");
      }
    }
    this.em.saveEmitter.emit("s");
  }

  playFabLogin() {
    // ToDo
  }
  loadPlayFab() {
    //  ToDo
  }
  savePlayFab() {
    //  ToDo
  }
}

// tslint:disable-next-line:max-classes-per-file
class CompressRequest {
  constructor(
    public obj: any,
    public zipped: string,
    public compress: boolean,
    public requestId: number
  ) {}
}
