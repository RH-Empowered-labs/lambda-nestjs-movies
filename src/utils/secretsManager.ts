
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export class SecretsManagerInternal {
    private secretClient: SecretsManagerClient;
    private region: string;
    private accessKeyId: string;
    private secretAccessKey: string;
    constructor(
        region: string, 
        accessKeyId: string,
        secretAccessKey: string,
    ){
        console.log('creating constructor to secrets manager')
        this.region = region;
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;

        console.log({
            region: this.region,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            }
        });
        try {
            this.secretClient = new SecretsManagerClient({
                region: this.region,
                credentials: {
                    accessKeyId: this.accessKeyId,
                    secretAccessKey: this.secretAccessKey,
                }
            });
        } catch (error) {
            console.log(`Error al construir el cliente: ${error}`);
            throw error;
        }
    }

    async getSecret(name: string): Promise<any> {
        try {
            const command = new GetSecretValueCommand({ SecretId: name });
            console.log(command);
            const response = await this.secretClient.send(command);
            const secret = response.SecretString;
            return secret;
        } catch (error) {
            console.log(`Error al recuperar el secreto: ${error}`);
            throw error;
        }
    }
}