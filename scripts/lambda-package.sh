#!/bin/bash
randomCodeVersion=$(echo $RANDOM | md5sum | head -c 20; echo)

# Package of code
echo Creating package of code
zip -r package-$randomCodeVersion.zip .

# Upload to S3
echo Upload file to s3
aws s3 cp package-$randomCodeVersion.zip s3://movies-lambdas-code/movies/package-$randomCodeVersion.zip

# Get Lambda Function name
echo Updating function code in AWS Lambda...
FUNCTION_NAME=$(aws ssm get-parameter --name "/lambda/MoviesFunctionArn" --query "Parameter.Value" --output text | awk -F'[:/]' '{print $NF}')

aws lambda update-function-code --function-name $FUNCTION_NAME --s3-bucket movies-lambdas-code --s3-key movies/package-$randomCodeVersion.zip

rm -rf package-$randomCodeVersion.zip