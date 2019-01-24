import { Component, AfterViewInit } from "@angular/core";
import { MainService } from "./main.service";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(":leave", [animate(500, style({ opacity: 0 }))])
    ])
  ]
})
export class AppComponent implements AfterViewInit {
  constructor(public ms: MainService) {}
  ngAfterViewInit(): void {
    this.ms.start();
  }
}
