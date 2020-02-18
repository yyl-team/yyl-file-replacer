const REG_NAME = /^.+\/([^/]+)\.\w+$/;
const expect = require('chai').expect;

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

module.exports = {
  sortAndCheck
};
