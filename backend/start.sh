#!/bin/sh
node -r dotenv/config dist/workers/assignmentWorker.js &
node -r dotenv/config dist/index.js