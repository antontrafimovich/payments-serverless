import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "at-payments-frontend", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const accessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "at-payments-frontend-access-identity"
    );

    bucket.grantRead(accessIdentity);

    const cf = new cloudfront.Distribution(this, "at-payments-frontend-dist", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
          originAccessIdentity: accessIdentity,
        }),
      },
    });

    new s3deploy.BucketDeployment(this, "at-payments-frontend-deployment", {
      sources: [s3deploy.Source.asset("./src/dist")],
      destinationBucket: bucket,
      distributionPaths: ["/*"],
      distribution: cf,
    });
  }
}
