import {Inject, Container} from '../src/index';


QUnit.module('sjs-di::Inject()');

QUnit.test('inject service', async assert => {
    let container = new Container();
    container.set(HttpClient, new HttpClient('/api'));

    let app = container.get(App);
    assert.ok(app);
    let result = await app.users.list();
    assert.equal(result, 'GET /api/users');
});

class HttpClient {
    constructor(url){
        this.url = url;
    }
    get(url){
        return Promise.resolve(`GET ${this.url}${url}`);
    }
}

// @Inject(HttpClient)
class Repository {
    static inject(){ return [HttpClient]; }
    constructor(http){
        this.http = http;
    }
    async getUsers() {
        return await this.http.get('/users');
    }
}

// @Inject(Repository)
class Users {

    static inject(){ return [Repository]; }

    constructor(repo){
        this.repo = repo;
    }
    async list(){
        return await this.repo.getUsers();
    }
}

// @Inject(Users)
class App {

    static inject(){ return [Users]; }

    constructor(users){
        this.users = users;
    }
}

