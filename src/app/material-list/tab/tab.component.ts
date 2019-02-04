import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { Resource } from "../..//model/resource/resource";
import { Subscription } from "rxjs";
import { MainService } from "../../main.service";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  @Input() id: string;
  @Input() name: string;
  @Input() shape: string;
  @Input() isEnding: boolean;
  @Input() quantity: Decimal;
  @Input() c: Decimal;
  // private subscriptions: Subscription[] = [];

  constructor(public ms: MainService) {}

  // ngOnInit() {
  //   this.subscriptions.push(
  //     this.ms.em.updateEmitter.subscribe(() => {
  //       this.cd.markForCheck();
  //     })
  //   );
  // }
  // ngOnDestroy() {
  //   this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  // }
}
