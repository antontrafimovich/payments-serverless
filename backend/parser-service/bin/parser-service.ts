#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ParserServiceStack } from "../lib/parser-service-stack";
import "dotenv/config"

const app = new cdk.App();
new ParserServiceStack(app, "ParserServiceStack", {
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION },
});
