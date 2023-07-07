
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export class ParameterStoreInternal {
    private parameterStoreClient: SSMClient;
    private region: string;
    private accessKeyId: string;
    private secretAccessKey: string;
    constructor(
        region: string, 
        accessKeyId: string,
        secretAccessKey: string,
    ){
        console.log('creating constructor to parameter store')
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
            this.parameterStoreClient = new SSMClient({
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

    async getParameter(name: string): Promise<any> {
        try {
            const command = new GetParameterCommand({Name: name });
            console.log(command);
            const response = await this.parameterStoreClient.send(command);
            const parameter = response.Parameter.Value;
            return parameter;
        } catch (error) {
            console.log(`Error al recuperar el parametro: ${error}`);
            throw error;
        }
    }
}