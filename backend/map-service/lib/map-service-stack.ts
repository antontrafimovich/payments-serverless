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

    const getMapTypesHandler = new lambda.NodejsFunction(
      this,
      "GetMapTypesHandler",
      {
        entry: "src/get-types/index.ts",
        handler: "handler",
        runtime: Runtime.NODEJS_18_X,
        environment: {
          NOTION_DATABASE: process.env.NOTION_DATABASE as string,
          NOTION_KEY: process.env.NOTION_KEY as string,
        },
      }
    );

    const createMapRecordHandler = new lambda.NodejsFunction(
      this,
      "CreateMapRecordHandler",
      {
        entry: "src/create-map-record/index.ts",
        handler: "handler",
        runtime: Runtime.NODEJS_18_X,
        environment: {
          NOTION_DATABASE: process.env.NOTION_DATABASE as string,
          NOTION_KEY: process.env.NOTION_KEY as string,
          REGION: process.env.AWS_REGION as string,
          GET_TYPES_FUNCTION_NAME: getMapTypesHandler.functionName,
        },
      }
    );

    getMapTypesHandler.grantInvoke(createMapRecordHandler);

    const gateway = new gw.RestApi(this, "AtPaymentsMapApi", {
      defaultCorsPreflightOptions: {
        allowOrigins: gw.Cors.ALL_ORIGINS,
        allowMethods: gw.Cors.ALL_METHODS,
      },
    });

    const getMapIntegration = new gw.LambdaIntegration(getMapHandler);
    const createMapRecordIntegration = new gw.LambdaIntegration(
      createMapRecordHandler
    );
    const getMapTypesIntegration = new gw.LambdaIntegration(getMapTypesHandler);

    const mapResource = gateway.root.addResource("map");

    const recordResource = mapResource.addResource("record");
    const typesResource = mapResource.addResource("types");

    mapResource.addMethod("GET", getMapIntegration);

    recordResource.addMethod("POST", createMapRecordIntegration);
    typesResource.addMethod("GET", getMapTypesIntegration);
  }
}
