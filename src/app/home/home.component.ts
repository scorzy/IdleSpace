import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "../main.service";
import { ResourceGroup } from "../model/resource/resourceGroup";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor(public ms: MainService) {}

  ngOnInit() {}
  getGroupId(index, list: ResourceGroup) {
    return list.id;
  }
  getResId(index, res: ResourceGroup) {
    return res.id;
  }
}
