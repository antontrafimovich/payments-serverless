import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as gw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class MapServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getMapHandler = new lambda.NodejsFunction(this, "GetMapHandler", {
      entry: "src/get-map/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        NOTION_DATABASE: process.env.NOTION_DATABASE as string,
        NOTION_KEY: process.env.NOTION_KEY as string,
      },
    });

    const gateway = new gw.RestApi(this, "AtPaymentsMapApi", {
      defaultCorsPreflightOptions: {
        allowOrigins: gw.Cors.ALL_ORIGINS,
        allowMethods: gw.Cors.ALL_METHODS,
      },
    });

    const getMapIntegration = new gw.LambdaIntegration(getMapHandler);

    gateway.root.addResource("map").addMethod("GET", getMapIntegration);
  }
}
