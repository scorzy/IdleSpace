import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit
} from "@angular/core";
import { OptionsService } from "src/app/options.service";
declare let preventScroll;

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  OptionsService = OptionsService;
  constructor(public os: OptionsService) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {}
}
