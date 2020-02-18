const fs = require('fs');
const path = require('path');
// const expect = require('chai').expect;
const frp = require('../../lib/replacer');
const { sortAndCheck } = require('../fn/util');

describe('frp.htmlPathMatch', () => {
  it('replacer.htmlPathMatch()', (done) => {
    const HTML_DEMO_PATH = path.join(__dirname, '../demo/demo.html');
    const ctx = fs.readFileSync(HTML_DEMO_PATH).toString();
    const rPaths = [];
    frp.htmlPathMatch(ctx, (str) => {
      rPaths.push(str);
      return str;
    });

    sortAndCheck(rPaths);
    done();
  });
});
