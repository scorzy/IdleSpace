import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Resource } from "../../model/resource/resource";
import { OptionsService } from "../../options.service";
import { Subscription } from "rxjs";
import { MainService } from "../../main.service";

@Component({
  selector: "app-res-line",
  templateUrl: "./res-line.component.html",
  styleUrls: ["./res-line.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResLineComponent implements OnInit, OnDestroy {
  @Input() res: Resource;
  private subscriptions: Subscription[] = [];

  constructor(
    public os: OptionsService,
    private ms: MainService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
