import { Context, APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../src/handler/add-user-handler';

describe('test', () => {
    it('Should not return undefined', () => {
        const a = handler({} as APIGatewayProxyEvent, {} as Context);
        expect(a).not.toBeUndefined();
    });
});
