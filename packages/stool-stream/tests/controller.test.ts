import { StreamController, EventController } from '../src/index';

QUnit.module('@stool/stream/controller');

QUnit.test('Simple StreamController', async assert => {
    let unsubscibed = false;
    const controller = new StreamController(() => {
        controller.next(1);
        controller.next(2);
        controller.next(3);
        controller.close();
    }, () => unsubscibed = true);
    const buff: any = [];
    const subscription = await controller.stream.listen(item => buff.push(item));
    assert.deepEqual(buff, [1,2,3]);
    assert.ok(controller.closed, 'closed');
    assert.notOk(unsubscibed);
    await subscription.cancel();
    assert.ok(unsubscibed);

});
