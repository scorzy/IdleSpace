import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  @Input() id: string;
  @Input() shape: string;
  @Input() isEnding: boolean;
  @Input() quantity: Decimal;
  @Input() c: Decimal;
  @Input() showQta = true;
  @Input() cap = false;
  @Input() limit?: Decimal;
  @Input() cog = false;
  @Input() integer = false;
  @Input() link: string;

  constructor() {}
}
