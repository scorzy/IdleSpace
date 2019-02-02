import { EndInPipe } from "./end-in.pipe";
import { OptionsService } from "./options.service";

describe("EndInPipe", () => {
  const options = new OptionsService();
  options.generateFormatter();
  it("create an instance", () => {
    const pipe = new EndInPipe(options);
    expect(pipe).toBeTruthy();
  });
});
