const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const frp = require('../../lib/replacer');
const { sortAndCheck } = require('../fn/util');

describe('frp.jsPathMatchLegacy', () => {
  const JS_DEMO_PATH = path.join(__dirname, '../demo/demo.js');

  it('replacer.jsPathMatchLegacy()', (done) => {
    const ctx = fs.readFileSync(JS_DEMO_PATH).toString();
    const rPaths = [];
    frp.jsPathMatchLegacy(ctx, (str) => {
      rPaths.push(str);
      return str;
    });

    sortAndCheck(rPaths);
    done();
  });

  it('replacer.jsPathMatchLegacy() __url', (done) => {
    const ctx = `
      var a = __url('path/to/js')
    `;
    const rPaths = [];
    const r = frp.jsPathMatchLegacy(ctx, (str) => {
      rPaths.push(str);
      return str;
    });
    expect(r).to.equal(`
      var a = path/to/js
    `);
    done();
  });

  it('replacer.jsPathMatchLegacy() __html', (done) => {
    const ctx = `
      var a = __html('path/to/html')
    `;
    const rPaths = [];
    const r = frp.jsPathMatchLegacy(ctx, (str, type, q) => {
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

  it('replacer.htmlPathMatchLegacy() for script __url', (done) => {
    const ctx = `
      <script>
      var a = __url('path/to/js')
      </script>
    `;
    const rPaths = [];
    const r = frp.htmlPathMatchLegacy(ctx, (str) => {
      rPaths.push(str);
      return str;
    });
    expect(r).to.equal(`
      <script>
      var a = path/to/js
      </script>
    `);
    done();
  });
});
