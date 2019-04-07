import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "../main.service";
import { Action } from "../model/actions/abstractAction";

@Component({
  selector: "app-dark-matter",
  templateUrl: "./dark-matter.component.html",
  styleUrls: ["./dark-matter.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DarkMatterComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor(public ms: MainService) {}

  ngOnInit() {}

  getActId(index: number, base: Action) {
    return base.id;
  }
}
