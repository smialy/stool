import {
    LEVELS,
    LEVEL_NAMES,
    LEVEL_TO_MASK
} from '../src/consts';
import {
    Mask,
    Filter,
    Filterer
} from '../src/filter';


QUnit.module('sjs-log.Mask');

QUnit.test('default Mask', assert => {
    var mask = new Mask();
    assert.equal(null, mask.level);
    assert.equal(0, mask.mask);
});

QUnit.test('set level', assert => {
    var mask = new Mask();
    for(let i = 1; i <= 16; i*=2){
      mask.level = i;
      //example: 1000(8) => 1111(15)
      assert.equal(i*2-1, mask.mask);
    }
});
