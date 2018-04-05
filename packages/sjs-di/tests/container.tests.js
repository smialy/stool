import {Container} from '../src/container';


QUnit.module('sjs-di :: Container');

QUnit.test('return instance for simple class', assert => {
    class App {}

    let container = new Container();
    let app = container.get(App);

    assert.ok(app instanceof App);
});

QUnit.test('return instance by static inject() method', assert => {
    class Service {}

    class App {
        static inject() { return [Service]; }
        constructor(service) {
            this.service = service;
        }
    }

    let container = new Container();
    let app = container.get(App);
    assert.ok(app.service instanceof Service);
});

QUnit.test('return instance by inject attribut', assert => {
    class Service {}

    class App {
        constructor(service) {
            this.service = service;
        }
    }
    App.inject = [Service];

    let container = new Container();
    let app = container.get(App);
    assert.ok(app.service instanceof Service);
});

QUnit.test('inject singleton service by static metod', assert => {
    class App1 {
        static inject() { return [Service]; }
        constructor(service) {
            this.service = service;
        }
    }
    class App2 {
        static inject() { return [Service]; }
        constructor(service) {
            this.service = service;
        }
    }
    class Service {}

    let container = new Container();
    let app1 = container.get(App1);
    let app2 = container.get(App2);
    assert.ok(app1.service instanceof Service);
    assert.ok(app2.service instanceof Service);
    assert.equal(app1.service, app2.service);
});

QUnit.test('inject singleton service by inject attribute', assert => {
    class Service {}
    class App1 {
        constructor(service) {
            this.service = service;
        }
    }
    App1.inject = [Service];
    class App2 {
        constructor(service) {
            this.service = service;
        }
    }
    App2.inject = [Service];

    let container = new Container();
    let app1 = container.get(App1);
    let app2 = container.get(App2);
    assert.ok(app1.service instanceof Service);
    assert.ok(app2.service instanceof Service);
    assert.equal(app1.service, app2.service);
});

QUnit.test('retunn instance with two dependencies', assert => {
    class Service1 {}
    class Service2 {}

    class App {
        static inject() { return [Service1, Service2]; }
        constructor(service1, service2) {
            this.service1 = service1;
            this.service2 = service2;
        }
    }

    let container = new Container();
    let app = container.get(App);
    assert.ok(app.service1 instanceof Service1);
    assert.ok(app.service2 instanceof Service2);
});

QUnit.test('should retune instance using instance dependencies', assert => {
    class Service1 {}
    class Service2 {}

    class App {
        static inject() { return [Service1, Service2]; }
        constructor(service1, service2) {
            this.service1 = service1;
            this.service2 = service2;
        }
    }

    let container = new Container();
    container.registerInstance(Service1, new Service1());
    container.registerInstance(Service2, new Service2());
    let app = container.get(App);
    assert.ok(app.service1 instanceof Service1);
    assert.ok(app.service2 instanceof Service2);
});

QUnit.test('loads using static inject() method', assert => {
    class Service {}

    class App {
        static inject() { return [Service]; }
        constructor(service) {
            this.service = service;
        }
    }

    class ChildApp extends App {}

    let container = new Container();
    let app = container.get(ChildApp);
    assert.ok(app.service instanceof Service);
});

QUnit.test('loads using inject attribute', assert => {
    class Service {}
    class App {
        constructor(service) {
            this.service = service;
        }
    }
    App.inject = [Service];

    class ChildApp extends App {}

    let container = new Container();
    let app = container.get(ChildApp);
    assert.ok(app.service instanceof Service);
});
QUnit.test('loads using static inject() method', assert => {
    class Service1 {}
    class Service2 {}

    class App {
        static inject() { return [Service1]; }
        constructor(service1) {
            this.service1 = service1;
        }
    }

    class ChildApp extends App {
        static inject() { return [Service2]; }
        constructor(service2, ...others) {
            super(...others);
            this.service2 = service2;
        }
    }

    let container = new Container();
    let app = container.get(ChildApp);
    assert.ok(app.service1 instanceof Service1);
    assert.ok(app.service2 instanceof Service2);
});

QUnit.test('loads using inject attribute', assert => {
    class Service1 {}
    class Service2 {}

    class App {
        constructor(service1) {
            this.service1 = service1;
        }
    }

    class ChildApp extends App {
        constructor(service2, service1) {
            super(service1);
            this.service2 = service2;
        }
    }
    App.inject = [Service1];
    ChildApp.inject = [Service2];

    let container = new Container();
    let app = container.get(ChildApp);
    assert.ok(app.service1 instanceof Service1);
    assert.ok(app.service2 instanceof Service2);
});
