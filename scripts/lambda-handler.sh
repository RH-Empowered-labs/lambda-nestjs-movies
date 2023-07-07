#!/bin/bash

# optener el parametro de parameter store
PARAMETER_VALUE=$(aws ssm get-parameter --name "/lambda/MoviesFunctionArn" --query "Parameter.Value" --output text)


# Traer el nombre de la función desde el arn
FUNCTION_NAME=$(echo $PARAMETER_VALUE | awk -F'[:/]' '{print $NF}')

# AWS CLI para obtener la configuración de la función Lambda
LAMBDA_CONFIG=$(aws lambda get-function-configuration --function-name $FUNCTION_NAME)

# 'jq' para analizar el JSON y extraer el valor del manejador
HANDLER=$(echo $LAMBDA_CONFIG | jq -r '.Handler')

echo "El manejador de la función $FUNCTION_NAME es: $HANDLER"

# Verifica si el manejador es diferente de main.handler
if [ "$HANDLER" != "dist/lambda.handler" ]; then
  echo "Actualizando el manejador de la función a main.handler..."
  # Actualiza la configuración del manejador de la función
  aws lambda update-function-configuration --function-name $FUNCTION_NAME --handler "dist/lambda.handler" >/dev/null
  echo "Se ha actualizado el manejador de la función $FUNCTION_NAME a main.handler"
fi