#!/usr/bin/env node
import "dotenv/config";
import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { WebStack } from "../lib/web-stack";

const app = new cdk.App();
new WebStack(app, "WebStack", {
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION },
});
