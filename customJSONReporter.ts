import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import fs from "fs";
import path from "path";

class CustomJSONReporter implements Reporter {
  private startTime: number = Date.now();
  private passedTests: number = 0;
  private failedTests: number = 0;
  private skippedTests: number = 0;
  private results: any[] = []; // Array to store the results of all tests
  private lastTest: { title: string; status: string } = {
    title: "",
    status: "",
  };

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
    this.startTime = Date.now(); // Record the start time
  }

  onTestBegin(test: TestCase) {
    console.log(`Starting test ${test.title}`);
  }

  private updateStatusCount(status: string, direction: "up" | "down") {
    switch (status) {
      case "passed":
        if (direction === "up") {
          this.passedTests++;
        } else {
          this.passedTests--;
        }
        break;
      case "failed":
        if (direction === "up") {
          this.failedTests++;
        } else {
          this.failedTests--;
        }
        break;
      case "skipped":
        if (direction === "up") {
          this.skippedTests++;
        } else {
          this.skippedTests--;
        }
        break;
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (this.lastTest.title) {
      if (this.lastTest.title === test.title) {
        this.updateStatusCount(this.lastTest.status, "down");
      }
    }
    this.lastTest = { title: test.title, status: result.status };

    switch (result.status) {
      case "passed":
        this.updateStatusCount("passed", "up");
        break;
      case "failed":
        this.updateStatusCount("failed", "up");
        break;
      case "skipped":
        this.updateStatusCount("skipped", "up");
        break;
    }
  }

  onEnd(result: FullResult) {
    const endTime = Date.now(); // Record the end time
    const duration = (endTime - this.startTime) / 1000; // Calculate the duration

    console.log(`Finished the run: ${result.status}`);
    console.log(`The run took ${duration} seconds`);

    const combinedData = {
      runName: "ui-tests",
      date: Date.now(),
      address: process.env.APPLICATION_URL,
      tag: process.env.TAG_SEQUENCE ? process.env.TAG_SEQUENCE : "all",
      environment: process.env.ENV,
      dataMode: "recreate",
      runTime: duration,
      testsCount: this.passedTests + this.failedTests + this.skippedTests,
      results: {
        passed: this.passedTests,
        failed: this.failedTests,
        skipped: this.skippedTests,
      },
    };

    const jsonResult = JSON.stringify(combinedData);
    const resultsFolderPath = path.join(__dirname, "test-results");
    if (!fs.existsSync(resultsFolderPath)) {
      fs.mkdirSync(resultsFolderPath);
    }

    const filePath = path.join(resultsFolderPath, "combined.json");
    fs.writeFileSync(filePath, jsonResult);
  }
}

export default CustomJSONReporter;
