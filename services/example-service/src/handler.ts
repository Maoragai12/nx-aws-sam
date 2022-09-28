'use strict';

import { Context, SQSEvent } from 'aws-lambda';

export const handler = (event: SQSEvent, context: Context) => {
    console.log('EVENT ==========> %j', event);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('XXX ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('XXXX ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);
    console.log('CONTEXT ==========> %j', context);

    return;
};
