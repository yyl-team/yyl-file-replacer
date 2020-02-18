const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const frp = require('../../lib/replacer');
const { sortAndCheck } = require('../fn/util');

describe('frp.jsPathMatch', () => {
  const JS_DEMO_PATH = path.join(__dirname, '../demo/demo.js');

  it('replacer.jsPathMatch()', (done) => {
    const ctx = fs.readFileSync(JS_DEMO_PATH).toString();
    const rPaths = [];
    frp.jsPathMatch(ctx, (str) => {
      rPaths.push(str);
      return str;
    });

    sortAndCheck(rPaths);
    done();
  });

  it('replacer.jsPathMatch() __url', (done) => {
    const ctx = `
      var a = __url('path/to/js')
    `;
    const rPaths = [];
    const r = frp.jsPathMatch(ctx, (str) => {
      rPaths.push(str);
      return str;
    });
    expect(r).to.equal(`
      var a = 'path/to/js'
    `);
    done();
  });

  it('replacer.jsPathMatch() __html', (done) => {
    const ctx = `
      var a = __html('path/to/html')
    `;
    const rPaths = [];
    const r = frp.jsPathMatch(ctx, (str, type, q) => {
      rPaths.push({ str, type, q });
      return 'abc';
    });
    expect(r).to.equal(`
      var a = 'abc'
    `);
    expect(rPaths).to.deep.equal([
      { str: 'path/to/html', type: '__html', q: '\''}
    ]);
    done();
  });
});
