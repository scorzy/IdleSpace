import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Research } from "src/app/model/research/research";
import { MainService } from "src/app/main.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-research",
  templateUrl: "./research.component.html",
  styleUrls: ["./research.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchComponent implements OnInit, OnDestroy {
  @HostBinding("class")
  card = "card drag-item";

  @Input() res: Research;
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

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
