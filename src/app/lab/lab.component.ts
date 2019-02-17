import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "../main.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-lab",
  templateUrl: "./lab.component.html",
  styleUrls: ["./lab.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor(public ms: MainService) {}

  ngOnInit() {}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.ms.game.researchManager.toDo,
      event.previousIndex,
      event.currentIndex
    );
  }
}
