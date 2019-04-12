import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
/**
 *  Display polynom
 *  a t^3 + b t^2 + ct
 *
 * @export
 */
@Component({
  selector: "app-polynom",
  templateUrl: "./polynom.component.html",
  styleUrls: ["./polynom.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolynomComponent implements OnInit {
  @Input()
  c: Decimal;

  constructor() {
    // Nothing
  }

  ngOnInit() {
    // Nothing
  }
}
