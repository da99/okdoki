#!/usr/bin/env node

if (!process.env.IS_DEV) {
  console.log("Machine is not dev.");
  console.log(process.env);
  process.exit(1);
}

