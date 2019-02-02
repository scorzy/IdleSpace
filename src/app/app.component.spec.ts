import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ClarityModule } from "@clr/angular";
import { MainService } from "./main.service";
import { Game } from "./model/game";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormatPipe } from "./format.pipe";
import { AbstractAction } from "./model/actions/abstractAction";
import { BuyAction } from "./model/actions/buyAction";
import { Resource } from "./model/resource/resource";
import { MultiPrice } from "./model/prices/multiPrice";
import { Price } from "./model/prices/price";

export function getMainService(): MainService {
  const ms = new MainService();
  ms.game = new Game();
  return ms;
}
export function getAction(): AbstractAction {
  return new BuyAction(
    new Resource("m"),
    new MultiPrice([new Price(new Resource("c"), 10)])
  );
}

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ClarityModule, BrowserAnimationsModule],
      declarations: [AppComponent, FormatPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });

  // it(`should have as title 'IdleSpace'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('IdleSpace');
  // });

  // it('should render title in a h1 tag', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to IdleSpace!');
  // });
});
