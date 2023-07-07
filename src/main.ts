function listAllFiles() {
    
    //requiring path and fs modules
    const path = require('path');
    const fs = require('fs');
    //joining path of directory 
    const directoryPath = path.join(__dirname, 'Documents');
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file); 
        });
    });
}


listAllFiles();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SecretsManagerInternal } from './utils/secretsManager';
import { JWTConfigDTO, RemoteApiConfigDTO } from './utils/dtos/secretsDTO';
import { ParameterStoreInternal } from './utils/parameterStore';

import { ExpressAdapter } from '@nestjs/platform-express';
import { Handler, Context } from 'aws-lambda';
import * as serverlessExpress from 'aws-serverless-express';
import * as express from 'express';


require('dotenv').config();

const secretFinder = new SecretsManagerInternal(
    process.env.AWS_REGION,
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
);

const parametersFinder = new ParameterStoreInternal(
    process.env.AWS_REGION,
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
);

const setCredentialsToEnv = async () => {
    // DynamoDB Table
    const dynamodbTableName: string = await parametersFinder.getParameter('/movies/dynamodb/MoviesTableName');
    process.env.DYNAMODB_TABLE_NAME = dynamodbTableName;

    // Get Secrets name of credentials
    const JWTSecretsName: string = await parametersFinder.getParameter('/movies/jwt/JwtConfigSecretName');
    const APISecretsName: string = await parametersFinder.getParameter('/movies/api/RemoteApiConfigSecretName');

    // Movie API
    const remoteApiConfig: RemoteApiConfigDTO = JSON.parse(
        await secretFinder.getSecret(APISecretsName)
    );
    
    process.env.MOVIES_API_URL_STRING = remoteApiConfig.apiUrl;
    process.env.MOVIES_API_KEY = remoteApiConfig.apiKey;
    process.env.MOVIES_API_URL_VERSION = remoteApiConfig.apiVersion;
    
    const jwtConfig: JWTConfigDTO = JSON.parse(
        await secretFinder.getSecret(JWTSecretsName)
    );

    process.env.JWT_SECRET = jwtConfig.secretKey
    process.env.JWT_EXP = jwtConfig.expirationTime
    
    console.log(process.env);
}

let server: any;

async function bootstrap() {
    await setCredentialsToEnv();
    if (process.env.NODE_ENV == 'local'){
        const app = await NestFactory.create(AppModule);
        let port = process.env.PORT || 3000
        await app.listen(port);
        console.log(`Application running in port ${port}`);
    } else {
        if (!server) {
            await setCredentialsToEnv();
            const expressApp = express.default();
            const adapter = new ExpressAdapter(expressApp);
            const app = await NestFactory.create(AppModule, adapter);
            await app.init();
            server = serverlessExpress.createServer(expressApp);
        }
        return server;
    }
}

if (process.env.NODE_ENV == 'local'){
    bootstrap();
}

export const handler: Handler = async (event: any, context: Context) => {
    const server = await bootstrap();
    return serverlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
