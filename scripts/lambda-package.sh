#!/bin/bash
randomCodeVersion=$(echo $RANDOM | md5sum | head -c 20; echo)

FUNCTION_NAME=$(aws ssm get-parameter --name "/lambda/MoviesFunctionArn" --query "Parameter.Value" --output text | awk -F'[:/]' '{print $NF}')

# Package node_modules as a layer
echo Creating layer of dependencies
zip -r -9 node_modules.zip node_modules

# Upload layer to S3
echo Upload layer to s3
aws s3 cp node_modules.zip s3://movies-lambdas-code/layers/node_modules-$randomCodeVersion.zip

# Creating layer
LAYER_ARN=$(aws lambda publish-layer-version --layer-name movies_node_modules --content S3Bucket=movies-lambdas-code,S3Key=layers/node_modules-$randomCodeVersion.zip --compatible-runtimes nodejs18.x | jq -r '.LayerVersionArn')
aws lambda update-function-configuration --function-name $FUNCTION_NAME --layers $LAYER_ARN

rm -rf node_modules

# Package of code
echo Creating package of code
zip -r -9 package-$randomCodeVersion.zip .

# Upload to S3
echo Upload file to s3
aws s3 cp package-$randomCodeVersion.zip s3://movies-lambdas-code/movies/package-$randomCodeVersion.zip

# Get Lambda Function name
echo Updating function code in AWS Lambda...

aws lambda update-function-code --function-name $FUNCTION_NAME --s3-bucket movies-lambdas-code --s3-key movies/package-$randomCodeVersion.zip

rm -rf package-$randomCodeVersion.zip
