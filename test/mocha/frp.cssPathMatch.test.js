const fs = require('fs');
const path = require('path');
// const expect = require('chai').expect;
const frp = require('../../lib/replacer');
const { sortAndCheck } = require('../fn/util');

describe('frp.cssPathMatch', () => {
  it('replacer.cssPathMatch()', (done) => {
    const CSS_DEMO_PATH = path.join(__dirname, '../demo/demo.css');

    const ctx = fs.readFileSync(CSS_DEMO_PATH).toString();
    const rPaths = [];
    frp.cssPathMatch(ctx, (str) => {
      rPaths.push(str);
      return str;
    });

    sortAndCheck(rPaths);
    done();
  });
});
