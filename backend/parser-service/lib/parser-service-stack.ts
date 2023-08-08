import * as cdk from "aws-cdk-lib";
import * as gw from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class ParserServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const parseHandler = new lambda.NodejsFunction(this, "ParseHandler", {
      entry: "src/functions/parse-report.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        NAME: "ANTON",
      },
    });

    const gateway = new gw.RestApi(this, "AtPaymentsApi");
    const parseHandlerIntegration = new gw.LambdaIntegration(parseHandler);
    gateway.root
      .addResource("report")
      .addMethod("POST", parseHandlerIntegration);
  }
}
