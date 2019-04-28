import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";
import { SearchAutomator } from "src/app/model/automators/searchAutomator";

@Component({
  selector: "app-search-automator",
  templateUrl: "./search-automator.component.html",
  styleUrls: ["./search-automator.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAutomatorComponent implements OnInit {
  auto: SearchAutomator;

  constructor(public ms: MainService) {}

  ngOnInit() {
    this.auto = this.ms.game.automatorManager.searchAutomator;
  }
}
