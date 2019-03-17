import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { Zone } from "src/app/model/enemy/zone";
import { MainService } from "src/app/main.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-zone",
  templateUrl: "./zone.component.html",
  styleUrls: ["./zone.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZoneComponent implements OnInit, OnDestroy {
  @Input() zone: Zone;

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscriptions.push(
      this.ms.em.battleEndEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
