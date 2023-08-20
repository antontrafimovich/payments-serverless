import "dotenv/config";

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
      entry: "src/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        NOTION_DATABASE: process.env.NOTION_DATABASE as string,
        NOTION_KEY: process.env.NOTION_KEY as string,
        PHONE_NUMBER: process.env.PHONE_NUMBER as string,
      },
    });

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
