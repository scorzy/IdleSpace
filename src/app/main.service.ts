import { Injectable, Inject } from "@angular/core";
import { createWorker, ITypedWorker } from "typed-web-workers";
import { Game } from "./model/game";
import { Emitters } from "./emitters";
import { DOCUMENT } from "@angular/common";
import { OptionsService } from "./options.service";
import { BattleService } from "./battle.service";
import { FormatPipe } from "./format.pipe";
import { ToastrService } from "ngx-toastr";
import { EndInPipe } from "./end-in.pipe";

declare let LZString: any;
declare let PlayFab: any;
declare let kongregateAPI: any;

const UP_INTERVAL = 200; // 5 fps
const SAVE_INTERVAL_1 = 1 * 60 * 1000;
const SAVE_INTERVAL_3 = 3 * 60 * 1000;
const SAVE_INTERVAL_5 = 5 * 60 * 1000;
const SAVE_INTERVAL_PLAYFAB = 20 * 60 * 1000;
const NO_REINFORCE_INTERVAL = 60 * 1000;

export function getUrl() {
  return (
    document.location.protocol +
    "//" +
    document.location.host +
    (document.location.pathname === "/context.html"
      ? "/"
      : document.location.pathname)
  );
}
@Injectable({
  providedIn: "root"
})
export class MainService {
  static formatPipe: FormatPipe;
  static endInPipe: EndInPipe;
  static toastr: ToastrService;
  static navalCapReinforceToast = false;
  static researchesCompleted: string[];

  zipWorker: ITypedWorker<CompressRequest, CompressRequest2>;
  game: Game;
  show = false;
  lastUnitUrl = "/home/res/m";
  last: number;
  em = Emitters.getInstance();
  playFabLogged = false;
  theme: HTMLLinkElement;
  overviewTaActive = false;
  lastSave = null;
  autoSaveInterval = -1;
  kongregate: any;
  readonly titleId = "BE193";
  playFabId = -1;
  lastNavalCapMessage = 0;
  webWorker = true;
  hotkeyEnabled = true;
  showDetails = true;
  lastPlayFabSave = 0;

  constructor(
    public options: OptionsService,
    public battleService: BattleService,
    @Inject(DOCUMENT) private document: Document,
    public toastr: ToastrService
  ) {
    MainService.toastr = this.toastr;
    this.webWorker = typeof Worker !== "undefined";
    this.battleService.em = this.em;
    this.theme = this.document.createElement("link");
    this.theme.rel = "stylesheet";
    this.theme.type = "text/css";
    this.document
      .querySelector("head")
      .insertBefore(
        this.theme,
        document
          .getElementsByTagName("head")[0]
          .getElementsByTagName("style")[0]
      );

    const url = getUrl();
    this.zipWorker = createWorker({
      workerFunction: this.comp,
      onMessage: this.onZip.bind(this),
      onError: error => {},
      importScripts: [
        url + "lz-string.min.js",
        url + "assets/compressRequest2.js"
      ]
    });

    MainService.formatPipe = new FormatPipe(this.options);
    MainService.endInPipe = new EndInPipe(this.options);
  }
  start() {
    const savedData = localStorage.getItem("saveIS");
    // if (!savedData || savedData === null) {
    //   savedData = localStorage.getItem("save");
    // }

    if (savedData) {
      this.load(savedData);
      this.setTheme();
    } else {
      this.setTheme();
      this.game = new Game();
    }

    setInterval(this.update.bind(this), UP_INTERVAL);
    // setTimeout(() => this.startAutoSave.bind(this), 1000 * 60);
    this.startAutoSave();

    setTimeout(() => {
      if (!this.game) {
        this.setTheme();
        this.game = new Game();
      }
    }, 5 * 1000);

    setInterval(() => {
      if (this.options.playFabAutoSave) this.save(true, true);
    }, SAVE_INTERVAL_PLAYFAB);

    this.show = true;

    //  Kong Api
    const url =
      window.location !== window.parent.location
        ? document.referrer
        : document.location.href;

    if (url.includes("kongregate") && typeof kongregateAPI !== "undefined") {
      kongregateAPI.loadAPI(() => {
        this.kongregate = kongregateAPI.getAPI();
        console.log("KongregateAPI Loaded");
        this.playFabLogin();

        setTimeout(() => {
          try {
            console.log("Kongregate build");
            this.sendKong();
          } catch (e) {
            console.log("Error: " + e.message);
          }
        }, 5 * 60 * 1000);
      });
    }
  }

  update() {
    if (!this.game) return false;
    MainService.researchesCompleted = [];

    const now = Date.now();
    const diff = (now - this.last) / 1000;
    // diff = diff * 1e10;
    this.game.update(diff);
    this.last = now;
    this.em.updateEmitter.emit(diff);

    if (
      MainService.navalCapReinforceToast &&
      this.lastNavalCapMessage + NO_REINFORCE_INTERVAL < now
    ) {
      this.lastNavalCapMessage = now;
      MainService.toastr.warning(
        "Fleet not reinforced. Manual configuration needed!",
        "Exceeding naval capacity"
      );
    }
    if (MainService.researchesCompleted.length > 0) {
      if (MainService.researchesCompleted.length > 4) {
        MainService.toastr.show(
          "",
          Math.floor(MainService.researchesCompleted.length) +
            " Researches completed",
          {},
          "toast-research"
        );
      } else {
        MainService.researchesCompleted.forEach(r => {
          MainService.toastr.show("", r, {}, "toast-research");
        });
      }
    }
  }
  reload() {
    this.game.reload();
    this.em.updateEmitter.emit(0);
  }
  getSave(): any {
    const data: any = {};
    data.g = this.game.save();
    data.o = this.options.getSave();
    data.l = this.last;
    return data;
  }
  load(data?: any): any {
    let save = localStorage.getItem("saveIS");
    if (!save || save === null) {
      save = localStorage.getItem("save");
    }
    // console.log(save);
    if (save !== null) {
      this.zipWorker.postMessage(new CompressRequest(save, "", false, 2));
    } else {
      this.toastr.warning("", "Nothing to load");
    }
  }
  load2(data: any): any {
    if (data && data.g) {
      this.last = data.l;
      this.lastSave = data.l;
      if ("o" in data) this.options.restore(data.o);
      this.setTheme();
      this.game = new Game();
      this.game.load(data.g);
      this.show = true;
      this.toastr.show(
        "You were offline for " +
          MainService.endInPipe.transform(Date.now() - this.last),
        "Game Loaded",
        {},
        "toast-load"
      );
      this.startAutoSave();
    } else {
      this.toastr.error("See console", "Load Failed");
      console.log(data);
    }
    if (!this.game) {
      this.setTheme();
      this.game = new Game();
    }
  }
  import(str: string) {
    this.zipWorker.postMessage(new CompressRequest(str, "", false, 2));
  }

  export() {
    this.zipWorker.postMessage(
      new CompressRequest(JSON.stringify(this.getSave()), "", true, 1)
    );
  }
  save(auto = false, playfab = false) {
    if (!this.game) return false;
    let num = 0;
    if (auto) {
      num = 10;
    }
    if (playfab) {
      num += 100;
    }

    this.zipWorker.postMessage(
      new CompressRequest(JSON.stringify(this.getSave()), "", true, num)
    );
  }
  clear() {
    localStorage.removeItem("saveIS");
    localStorage.removeItem("saveDate");
    window.location.reload();
  }

  comp(input: CompressRequest, cb: (_: CompressRequest2) => void): void {
    if (input.compress) {
      let save = "";
      try {
        save = LZString.compressToBase64(input.obj);
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

  onZip(result: CompressRequest2): void {
    if (result.compress) {
      if (result.zipped !== "") {
        if (result.requestId === 0 || result.requestId === 10) {
          localStorage.setItem("saveIS", result.zipped);
          localStorage.setItem("saveDate", Date());
          this.lastSave = Date();
          if (result.requestId === 0 || this.options.autosaveNotification) {
            this.toastr.show("", "Game Saved", {}, "toast-save");
          }
        } else if (result.requestId === 1) {
          this.em.zipEmitter.emit(result.zipped);
        } else if (result.requestId === 100 || result.requestId === 110) {
          this.savePlayFab(result.zipped);
        }
        // console.log(result);
      } else {
        console.log("Error");
        this.toastr.error("Game not Saved");
      }
    } else {
      if (result.obj != null) {
        this.load2(result.obj);
      } else {
        console.log("Error");
        this.toastr.error("Game not Loaded");
      }
    }
    this.em.saveEmitter.emit("s");
  }

  //#region PlayFab
  playFabLogin() {
    if (!this.kongregate) {
      this.toastr.error(
        "You need to be logged in to Kongregate.",
        "PlayFab error"
      );
      return;
    }

    try {
      const authTicket = this.kongregate.services.getGameAuthToken();
      const requestData = {
        TitleId: this.titleId,
        KongregateId: this.kongregate.services.getUserId(),
        AuthTicket: authTicket,
        CreateAccount: true
      };
      try {
        PlayFab.ClientApi.LoginWithKongregate(
          requestData,
          this.playFabLoginCallback.bind(this)
        );
      } catch (e) {
        console.log("Unable to send login request to PlayFab.");
        this.toastr.error("Unable to send login request to PlayFab.");
      }
    } catch (e) {
      console.log(e);
    }
  }
  playFabLoginCallback(data, error) {
    if (error) {
      console.log(error.errorMessage);
      this.toastr.error(
        "You need to be logged in to Kongregate.",
        "Couldn't log in to PlayFab Cloud"
      );
      return;
    }
    if (data) {
      this.playFabId = data.data.PlayFabId;
      PlayFab.settings.titleId = "BE193";
      this.playFabLogged = true;
      Emitters.getInstance().saveEmitter.emit("logged");
      console.log("Logged in to playFab");
      this.toastr.info("Logged in to PlayFab");
    }
  }
  savePlayFab(save: string) {
    if (
      !save ||
      save.length < 2 ||
      !this.playFabId ||
      typeof PlayFab === "undefined" ||
      typeof PlayFab.ClientApi === "undefined"
    ) {
      return false;
    }

    // Cut compressed object into strings of 10,000 bytes for PlayFab
    const chunks = save.match(/.{1,10000}/g);
    if (chunks.length > 10) {
      this.toastr.error("size limit exceeded", "Error saving to cloud");
    }
    // convert array into object with numbers as keys
    // const data = $.extend({}, chunks);
    const data: any = {};
    for (let i = 0; i < chunks.length; i++) data[i] = chunks[i];

    const requestData = {
      TitleId: this.titleId,
      PlayFabId: this.playFabId,
      Data: data
    };
    try {
      PlayFab.ClientApi.UpdateUserData(
        requestData,
        this.saveToPlayFabCallback.bind(this)
      );
      this.lastPlayFabSave = Date.now();
      this.em.saveEmitter.emit("play fab");
    } catch (e) {
      console.log(e);
    }
  }
  saveToPlayFabCallback(data, error) {
    if (error) {
      console.log(error);
      return false;
    }
    if (data) {
      console.log("Game Saved!");
      this.toastr.success("Game saved to PlayFab");
      return true;
    }
  }
  loadPlayFab() {
    if (
      !this.playFabId ||
      typeof PlayFab === "undefined" ||
      typeof PlayFab.ClientApi === "undefined"
    ) {
      console.log(this.playFabId, PlayFab);
      return false;
    }
    const requestData = {
      Keys: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "save"],
      PlayFabId: this.playFabId
    };
    try {
      console.log("attempting to send load request");
      PlayFab.ClientApi.GetUserData(
        requestData,
        this.loadFromPlayFabCallback.bind(this)
      );
      console.log("sent load request");
    } catch (e) {
      console.log(e);
    }
  }
  loadFromPlayFabCallback(data, error) {
    try {
      console.log("loading callback fired");
      // console.log(data, error);
      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        if (data.data.Data) {
          const raw = Object.values(data.data.Data)
            .map((val: any) => {
              return val.Value;
            })
            .join("");
          // console.log(raw);
          this.import(raw);
        }
      }
    } catch (e) {
      console.log(e);
      this.toastr.error("PlayFab Load error");
    }
  }
  //#endregion

  setTheme() {
    const myTheme =
      "assets/" + (this.options.dark ? "theme.dark.css" : "theme.light.css");
    if (myTheme !== this.theme.href) this.theme.href = myTheme;
  }
  startAutoSave() {
    console.log("A " + this.options.autoSave);
    if (this.autoSaveInterval > -1) {
      clearInterval(this.autoSaveInterval);
    }

    let interval = 5;
    switch (this.options.autoSave) {
      case "1":
        interval = SAVE_INTERVAL_1;
        break;
      case "3":
        interval = SAVE_INTERVAL_3;
        break;
      case "5":
        interval = SAVE_INTERVAL_5;
        break;
      case "off":
        interval = -1;
        break;
    }

    if (interval > 0) {
      console.log("AutoSave: " + interval);
      this.autoSaveInterval = window.setInterval(
        this.save.bind(this, true),
        interval
      );
    }
  }

  /**
   * Sends high score to kongregate
   */
  sendKong(notify = false) {
    if (!this.game || !this.kongregate) return false;
    try {
      this.kongregate.stats.submit(
        "Prestige",
        this.game.prestigeManager.totalPrestige
      );
      this.kongregate.stats.submit(
        "Ascension",
        this.game.prestigeManager.ascension
      );
      this.kongregate.stats.submit("MaxEnemy", this.game.enemyManager.maxLevel);
      this.kongregate.stats.submit(
        "Log10(Max Dark Matter)",
        this.game.darkMatterManager.darkMatter.quantity.log10()
      );
      if (notify) {
        this.toastr.success("Score submitted", "Kongregate");
      }
    } catch (ex) {
      if (notify) {
        this.toastr.error(
          "Score not submitted, an error occurred",
          "Kongregate"
        );
      }
    }
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
