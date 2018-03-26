import {Container} from '../src/cointainer';
import {Inject} from '../src/decorators';


QUnit.module('sjs-di::Inject()');

QUnit.test('inject service', assert => {
    class App {
        constructor(service) {
            this.service = service;
        }
    }
    class Service {}

    Inject(Service)(App);

    let container = new Container();
    let app = container.get(App);
    assert.ok(app.service instanceof Service);
});

QUnit.test('inject singleton service', assert => {
    class App1 {
        constructor(service) {
            this.service = service;
        }
    }
    class App2 {
        constructor(service) {
            this.service = service;
        }
    }
    class Service {}

    Inject(Service)(App1);
    Inject(Service)(App2);

    let container = new Container();
    let app1 = container.get(App1);
    let app2 = container.get(App2);
    assert.ok(app1.service instanceof Service);
    assert.ok(app2.service instanceof Service);
    assert.equal(app1.service, app2.service);
});

