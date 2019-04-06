import { TestBed } from "@angular/core/testing";

import { MainService } from "./main.service";
import { defaultImport } from "./app.component.spec";

describe("MainService", () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: defaultImport() }));

  it("should be created", () => {
    const service: MainService = TestBed.get(MainService);
    expect(service).toBeTruthy();
  });
});
