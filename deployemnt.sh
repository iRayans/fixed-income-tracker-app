#!/usr/bin/env bash

# First build the project
echo "The current directory is $(pwd)."
npm run build

# upload the new built files to S3 object
aws s3 cp --recursive dist/ s3://salar-tracker