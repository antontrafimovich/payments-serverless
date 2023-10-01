#!/usr/bin/env node
import "dotenv/config";
import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { GoogleServiceStack } from "../lib/google-service-stack";

const app = new cdk.App();
new GoogleServiceStack(app, "GoogleServiceStack", {
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION },
});
