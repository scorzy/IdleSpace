import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";
import { ResNameFilter } from "src/app/model/utility/resNameFilter";

@Component({
  selector: "app-lab-auto",
  templateUrl: "./lab-auto.component.html",
  styleUrls: ["./lab-auto.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabAutoComponent implements OnInit {
  constructor(public ms: MainService) {}
  public resNameFilter = new ResNameFilter();
  ngOnInit() {}
}
