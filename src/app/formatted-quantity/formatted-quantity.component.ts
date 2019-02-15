import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";

@Component({
  selector: "app-formatted-quantity",
  templateUrl: "./formatted-quantity.component.html",
  styleUrls: ["./formatted-quantity.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormattedQuantityComponent implements OnInit {
  @Input() quantity: Decimal;
  @Input() integer = false;
  @Input() monospace = true;

  constructor() {}

  ngOnInit() {}
}
