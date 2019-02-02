import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { Resource } from "../../model/resource/resource";

@Component({
  selector: "app-price-line",
  templateUrl: "./price-line.component.html",
  styleUrls: ["./price-line.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceLineComponent implements OnInit {
  @Input() unit: Resource;
  @Input() canBuy: boolean;
  @Input() price: Decimal;

  constructor() {}
  ngOnInit() {}
}
