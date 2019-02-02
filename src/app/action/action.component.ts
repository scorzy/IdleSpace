import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { AbstractAction } from "../model/actions/abstractAction";

@Component({
  selector: "app-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionComponent implements OnInit {
  @Input() action: AbstractAction;

  constructor() {}
  ngOnInit(): void {}
}
