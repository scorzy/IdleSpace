import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";
import { Automator } from "src/app/model/automators/automator";

@Component({
  selector: "app-search-auto",
  templateUrl: "./search-auto.component.html",
  styleUrls: ["./search-auto.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAutoComponent implements OnInit {
  automators = new Array<Automator>();

  constructor(public ms: MainService) {}

  ngOnInit() {
    this.automators = this.ms.game.automatorManager.searchAutomators.filter(a =>
      a.isUnlocked()
    );
  }
  autoId(index: number, auto: Automator) {
    return auto.id;
  }
}
