import { States, Actions, CONFIG } from './data';
import { factory } from '../src/builder';


QUnit.module('sjs-sm::State');


QUnit.test('Create using factory() method', assert => {
    const st = factory(CONFIG);
    assert.equal(st.currentState().name, States.OPENED);
    let states  = st.states;
    assert.equal(states.length, 3);
    assert.equal(states.length, 3);
});
