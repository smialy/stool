import { fromItem } from '../src/index';

QUnit.module('@stool/stream');

QUnit.test('fromItem(<Array>)', async assert => {
    const stream = fromItem<Number>([1, 2, 3]);
    const buff: any = [];
    stream.listen(item => buff.push(item));
    assert.deepEqual(buff, [1,2,3]);
});

QUnit.test('fromItem(<Promise>)', async assert => {
    const stream = fromItem<String>(Promise.resolve('promise'));
    const buff: any = [];
    stream.listen(item => buff.push(item));
    assert.deepEqual(buff, ['promise']);
});

QUnit.test('fromItem(<Function>)', async assert => {
    const fn = controller => {
        controller.next('function');
        controller.close();
    };
    const stream = fromItem<String>(fn);
    const buff: any = [];
    stream.listen(item => buff.push(item));
    assert.deepEqual(buff, ['function']);
});
