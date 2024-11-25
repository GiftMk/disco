import { failure, success, type Result } from "../result";

export class LoudnormJsonExtractor {
  private canRead = false;
  private lines: string[] = [];

  consume(line: string) {
    if (this.canRead) {
      this.lines.push(line);

      if (line.includes("}")) {
        this.canRead = false;
      }
    } else {
      if (line.includes("loudnorm")) {
        this.canRead = true;
      }
    }
  }

  reset() {
    this.lines = [];
  }

  extract(): Result<{
    [key: string]: string;
  }> {
    try {
      const object = JSON.parse(this.lines.join(""));
      return success(object);
    } catch (e) {
      if (e instanceof Error) {
        return failure(
          `Failed to extract Loudnorm JSON. The following error occurred ${e.message}`
        );
      }
      return failure("An unknown error occurred when extracting Loudnorm JSON");
    } finally {
      this.reset();
    }
  }
}
