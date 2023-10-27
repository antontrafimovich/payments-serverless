import "dotenv/config";

import * as cdk from "aws-cdk-lib";
import * as gw from "aws-cdk-lib/aws-apigateway";
import { Runtime, Function } from "aws-cdk-lib/aws-lambda";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class ParserServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const googleCreateSheetHandler = Function.fromFunctionArn(
      this,
      "GoogleCreateSheetHandler",
      process.env.GOOGLE_CREATE_SHEET_FUNCTION_ARN!
    );

    const parseHandler = new lambda.NodejsFunction(this, "ParseHandler", {
      entry: "src/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(9),
      environment: {
        NOTION_DATABASE: process.env.NOTION_DATABASE as string,
        NOTION_KEY: process.env.NOTION_KEY as string,
        PHONE_NUMBER: process.env.PHONE_NUMBER as string,
        GOOGLE_CREATE_SHEET_FUNCTION_NAME:
          googleCreateSheetHandler.functionName,
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI as string,
      },
    });
    googleCreateSheetHandler.grantInvoke(parseHandler);

    const gateway = new gw.RestApi(this, "AtPaymentsApi", {
      defaultCorsPreflightOptions: {
        allowOrigins: gw.Cors.ALL_ORIGINS,
        allowMethods: gw.Cors.ALL_METHODS,
      },
    });

    const parseHandlerIntegration = new gw.LambdaIntegration(parseHandler);
    gateway.root
      .addResource("report")
      .addMethod("POST", parseHandlerIntegration);
  }
}
