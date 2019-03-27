import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { SearchJob } from "src/app/model/enemy/searchJob";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  @HostBinding("class")
  contentArea = "content-area";

  constructor(public ms: MainService) {}

  ngOnInit() {}

  generate() {
    this.ms.game.enemyManager.startSearching(1);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.ms.game.enemyManager.searchJobs,
      event.previousIndex,
      event.currentIndex
    );
  }
  getJobId(index: number, job: SearchJob) {
    return job.id.toString();
  }
}
