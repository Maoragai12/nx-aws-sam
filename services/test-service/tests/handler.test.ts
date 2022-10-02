import { handler } from '../src/handler';

describe('test', () => {
    it('test1', () => {
        const a = handler('a' as any, 'b' as any);
        expect(a).toBeUndefined();
    });
});
