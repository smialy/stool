import { States, CONFIG } from './data';
import { factory } from '../src/builder';


QUnit.module('@stool/sm::State');


QUnit.test('Create using factory() method', assert => {
    const st = factory(CONFIG);
    assert.equal(st.currentState().name, States.OPENED);
    let states  = st.states;
    assert.equal(states.length, 3);
    assert.equal(states.length, 3);
});
