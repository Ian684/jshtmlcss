import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCents, totals, toCsv} from '../practice/expenses/core.mjs';
import {parseNumbers, insertionSteps} from '../practice/sorting/core.mjs';

test('integer money and CSV escaping', () => {
  assert.equal(parseCents('0.10') + parseCents('0.20'), 30);
  for (const value of ['-1','NaN','1.001','1e3','']) assert.throws(() => parseCents(value));
  assert.equal(totals([{category:'food',cents:10},{category:'food',cents:20}]).get('food'), 30);
  assert.match(toCsv([{category:'a,"b',cents:10}]), /"a,""b",0.10/);
  assert.match(toCsv([{category:'=1+1',cents:10}]), /"'=1\+1"/);
});

test('sorting steps preserve input and finish sorted', () => {
  for (const values of [[],[1],[3,1,3,-2],[5,4,3,2,1],[1,2,3]]) {
    const before = [...values]; const steps = insertionSteps(values);
    assert.deepEqual(values, before);
    assert.deepEqual(steps.at(-1).values, [...values].sort((a,b)=>a-b));
    assert.equal(steps[0].values.length, values.length);
  }
  assert.deepEqual(parseNumbers('3, -2  7'), [3,-2,7]);
  for (const value of ['','1.5','101','1,nope']) assert.throws(() => parseNumbers(value));
});
