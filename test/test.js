const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const replacer = require('../index.js');

describe('replacer test', () => {
  const HTML_DEMO_PATH = path.join(__dirname, './demo/demo.html');
  const CSS_DEMO_PATH = path.join(__dirname, './demo/demo.css');
  const JS_DEMO_PATH = path.join(__dirname, './demo/demo.js');

  const REG_NAME = /^.+\/([^/]+)\.\w+$/;

  const sortAndCheck = function (arr) {
    arr.sort((a, b) => {
      const aName = +a.replace(REG_NAME, '$1');
      const bName = +b.replace(REG_NAME, '$1');
      return aName - bName;
    });

    arr.forEach((iPath, index) => {
      const name = +iPath.replace(REG_NAME, '$1');
      expect(name).to.equal(index + 1);
    });
  };

  it('replacer.htmlPathMatch test', (done) => {
    const ctx = fs.readFileSync(HTML_DEMO_PATH).toString();
    const rPaths = [];
    replacer.htmlPathMatch(ctx, (str) => {
      rPaths.push(str);
      return str;
    });

    sortAndCheck(rPaths);
    done();
  });

  it('replacer.cssPathMatch test', (done) => {
    const ctx = fs.readFileSync(CSS_DEMO_PATH).toString();
    const rPaths = [];
    replacer.cssPathMatch(ctx, (str) => {
      rPaths.push(str);
      return str;
    });

    sortAndCheck(rPaths);
    done();
  });

  it('replacer.jsPathMatch test', (done) => {
    const ctx = fs.readFileSync(JS_DEMO_PATH).toString();
    const rPaths = [];
    replacer.jsPathMatch(ctx, (str) => {
      rPaths.push(str);
      return str;
    });

    sortAndCheck(rPaths);
    done();
  });
});


