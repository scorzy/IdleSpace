import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Action } from "../../model/actions/abstractAction";

@Component({
  selector: "app-action-header",
  templateUrl: "./action-header.component.html",
  styleUrls: ["./action-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionHeaderComponent {
  @Input() action: Action;
  @Input() quantity: Decimal;

  constructor() {
    //
  }
}
