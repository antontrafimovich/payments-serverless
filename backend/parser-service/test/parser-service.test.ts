import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as ParserService from "../lib/parser-service-stack";
import { Runtime } from "aws-cdk-lib/aws-lambda";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/parser-service-stack.ts
describe("parser-service-stack", () => {
  it("should have a Lambda service created", () => {
    const app = new cdk.App();
    const stack = new ParserService.ParserServiceStack(app, "MyTestStack");
    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::Lambda::Function", {});
  });

  it("should have a Lambda service created with Node 18 runtime", () => {
    const app = new cdk.App();
    const stack = new ParserService.ParserServiceStack(app, "MyTestStack");
    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: Runtime.NODEJS_18_X.toString(),
    });
  });
});
