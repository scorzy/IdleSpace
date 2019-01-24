import { FormatPipe } from "./format.pipe";
import { OptionsService } from "./options.service";

describe("FormatPipe", () => {
  it("create an instance", () => {
    const pipe = new FormatPipe(new OptionsService());
    expect(pipe).toBeTruthy();
  });
});
