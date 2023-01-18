'use strict';

import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log('EVENT =======> %j', event);
    console.log('CONTEXT =============================> %j', context);

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'hello world',
        }),
    };
};
