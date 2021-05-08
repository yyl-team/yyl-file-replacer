const expect = require('chai').expect;
const frp = require('../../lib/replacer');

describe('replacer.REG test', () => {
  const REG = frp.REG;
  it('frp.REG.HTML_PATH_REG', (done) => {
    const trueExamples = [
      '<a href="demo.js"></a>',
      '<a href=\'demo.js\'></a>',
      '<a href = "demo.js"></a>',
      '<img src="demo.js" alt="not this" />',
      '<iframe src="demo.js"></iframe>',
      '<script data-main="demo.js"></script>',
      '<link href="demo.js" />',
      '<img data-original="demo.js" />'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_PATH_REG)).not.equal(null);

      ctx.replace(REG.HTML_PATH_REG, (str, $1, $2, $3, $4) => {
        expect($4).to.equal('demo.js');
      });
    });
    done();
  });

  it('frp.REG.HTML_SCRIPT_REG', (done) => {
    const true01Examples = [
      '<script data-main="hello"></script>',
      '<script></script>'
    ];
    const true02Examples = [
      '<script type="javascript">var a = 1;</script>',
      '<script>\n var a = 1;\n</script>'
    ];
    true01Examples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_SCRIPT_REG)).not.equal(null);
    });
    true02Examples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_SCRIPT_REG)).not.equal(null);
      ctx.replace(REG.HTML_SCRIPT_REG, (str, $1, $2) => {
        expect($2.match(/var\sa\s=\s1/)).not.equal(null);
      });
    });
    done();
  });

  it('frp.REG.HTML_IGNORE_REG', (done) => {
    const trueExamples = [
      'about:blank;',
      'data:image/png;base64,xxxx',
      'javascript:;',
      '#router',
      '{{key}}'
    ];
    const falseExamples = [
      'http://www.testhost.com',
      '//www.testhost.com',
      'path/to/dest.js'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_IGNORE_REG)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_IGNORE_REG)).equal(null);
    });
    done();
  });

  it('frp.REG.HTML_SCRIPT_TEMPLATE_REG', (done) => {
    const trueExamples = [
      '<script type="text/html"> var a = 1; </script>',
      '<script type=\'text/html\'> var a = 1; </script>'
    ];
    const falseExamples = [
      '<script type="text/js">  var a = 1; </script>',
      '<script type="text/js">  var a = 1; </script>'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_SCRIPT_TEMPLATE_REG)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_SCRIPT_TEMPLATE_REG)).equal(null);
    });
    done();
  });

  it('frp.REG.HTML_ALIAS_REG', (done) => {
    const trueExamples = [
      '{$key}'
    ];
    const falseExamples = [
      '{{key}}',
      'path/to/{{$key}}'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_ALIAS_REG)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_ALIAS_REG)).equal(null);
    });
    done();
  });

  it('frp.REG.HTML_IS_ABSLUTE', (done) => {
    const trueExamples = [
      '/path/to/dest.js',
      '/{{sid}}/{{ssid}}'
    ];
    const falseExamples = [
      'http://www.testhost.com',
      '//www.testhost.com',
      'https://www.testhost.com',
      './path/to/dest.js'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_IS_ABSLUTE)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_IS_ABSLUTE)).equal(null);
    });
    done();
  });

  it('frp.REG.HTML_STYLE_TAG_REG', (done) => {
    const trueExamples = [
      '<a style="display: block;"></a>',
      '<a style=\'display: block;\'></a>'
    ];
    const falseExamples = [
      '<a title="jackness"></a>'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_STYLE_TAG_REG)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_STYLE_TAG_REG)).equal(null);
    });
    done();
  });

  it('frp.REG.HTML_STYLE_REG', (done) => {
    const trueExamples = [
      '<style>a {display: block;}</style>',
      '<style type="text/css">\na {display: block; }\n</style>'
    ];
    const falseExamples = [
      '<stylee></stylee>'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_STYLE_REG)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_STYLE_REG)).equal(null);
    });
    done();
  });

  it('frp.REG.HTML_SRC_COMPONENT_JS_REG', (done) => {
    const trueExamples = [
      '../components/p-aa/p-aa.js',
      '../components/t-aa/t-aa.js',
      '../components/p-aa-bb-cc/p-aa-bb-cc.js',
      '../components/p-aaBbCc/p-aaBbCc.js'
    ];
    const falseExamples = [
      '../components/p-aa/p-aa.css',
      '../components/w-aa/w-aa.js',
      '../components/r-aa/r-aa.js',
      './components/p-aa/p-aa.js',
      '../../components/p-aa/p-aa.js'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_SRC_COMPONENT_JS_REG)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_SRC_COMPONENT_JS_REG)).equal(null);
    });
    done();
  });

  it('frp.REG.HTML_SRC_COMPONENT_IMG_REG', (done) => {
    const trueExamples = [
      '../components/p-aa/images',
      '../components/t-aa/images',
      '../components/w-aa/images',
      '../components/r-aa/images',
      '../components/p-aa-bb-cc/images',
      '../components/p-aaBbCc/images'
    ];
    const falseExamples = [
      '../components/p-aa/img',
      '../components/z-aa/images',
      '../../components/p-aa/images',
      './components/p-aa/images',
      'components/p-aa/images'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_SRC_COMPONENT_IMG_REG)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.HTML_SRC_COMPONENT_IMG_REG)).equal(null);
    });
    done();
  });

  it('frp.REG.CSS_PATH_REG', (done) => {
    const trueExamples = [
      'a { background-images: url(demo.png) }',
      'a { background-images: url("demo.png") }',
      'a { background-images: url(\'demo.png\') }',
      'a { background-images: url (demo.png) }'
    ];
    const falseExamples = [
      'a { background-images: url (demo.png }'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.CSS_PATH_REG)).not.equal(null);
      ctx.replace(REG.CSS_PATH_REG, (str, $1, $2) => {
        expect($2).to.equal('demo.png');
      });
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.CSS_PATH_REG)).equal(null);
    });
    done();
  });

  it('frp.REG.CSS_PATH_REG2', (done) => {
    const trueExamples = [
      'a { filter:progid:DXImageTransform.Microsoft.Alpha.Microsoft.AlphaImageLoader(src=\'demo.png\');}',
      'a { filter:progid:DXImageTransform.Microsoft.Alpha.Microsoft.AlphaImageLoader(src="demo.png");}'
    ];
    const falseExamples = [
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.CSS_PATH_REG2)).not.equal(null);
      ctx.replace(REG.CSS_PATH_REG, (str, $1, $2) => {
        expect($2).to.equal('demo.png');
      });
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.CSS_PATH_REG2)).equal(null);
    });
    done();
  });

  it('frp.REG.CSS_IGNORE_REG', (done) => {
    const trueExamples = [
      'about:blank;',
      'data:image/png;base64,xxxx',
      'javascript:;',
      '#router',
      '{{key}}'
    ];
    const falseExamples = [
      'http://www.testhost.com',
      '//www.testhost.com',
      'path/to/dest.js'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.CSS_IGNORE_REG)).not.equal(null);
      ctx.replace(REG.CSS_PATH_REG, (str, $1, $2) => {
        expect($2).to.equal('demo.png');
      });
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.CSS_IGNORE_REG)).equal(null);
    });
    done();
  });

  it('frp.REG.CSS_IS_ABSLURE', (done) => {
    const trueExamples = [
      '/path/to/dest.js',
      '/{{sid}}/{{ssid}}'
    ];
    const falseExamples = [
      'http://www.testhost.com',
      '//www.testhost.com',
      'https://www.testhost.com',
      './path/to/dest.js'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.CSS_IS_ABSLURE)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.CSS_IS_ABSLURE)).equal(null);
    });
    done();
  });

  it('frp.REG.JS_DISABLE_AMD', (done) => {
    const trueExamples = [
      '/*amd:disabled*/',
      '/* amd : disabled */',
      '/* amd: disabled */',
      '/* amd: disabled; */',
      '/*    amd: disabled    */'
    ];
    const falseExamples = [
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.JS_DISABLE_AMD)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.JS_DISABLE_AMD)).equal(null);
    });
    done();
  });

  it('frp.REG.JS_EXCLUDE', (done) => {
    const trueExamples = [
      '/*exclude: liveplayer*/',
      '/*exclude: liveplayer, mod02*/',
      '/*exclude: liveplayer, mod02, mod03*/',
      '/* exclude : liveplayer , mod02 , mod03 */',
      '/*   exclude : liveplayer , mod02 , mod03   */',
      '/* exclude: liveplayer */'
    ];
    const falseExamples = [
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.JS_EXCLUDE)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.JS_EXCLUDE)).equal(null);
    });
    done();
  });

  it('frp.REG.JS_SUGAR__URL', (done) => {
    const trueExamples = [
      '/* var a = __url(\'demo.png\')*/',
      '/* var a = __url (\'demo.png\')*/',
      '/* var a = __url("demo.png")*/'
    ];
    const falseExamples = [
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.JS_SUGAR__URL)).not.equal(null);
      ctx.replace(REG.JS_SUGAR__URL, (str, $1, $2) => {
        expect($2).to.equal('demo.png');
      });
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.JS_SUGAR__URL)).equal(null);
    });
    done();
  });

  it('frp.REG.IS_HTTP', (done) => {
    const trueExamples = [
      'http://www.testhost.com',
      'https://www.testhost.com',
      '//www.testhost.com'
    ];
    const falseExamples = [
      '/www.testhost.com',
      'path/to/dest',
      './path/to/dest',
      '../path/to/dest',
      'F:/path/to/dest'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.IS_HTTP)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.IS_HTTP)).equal(null);
    });
    done();
  });

  it('frp.REG.IS_MAIN_REMOTE', (done) => {
    const trueExamples = [
      'path/to/dest/demo.html',
      'path/to/dest/demo.tpl',
      'path/to/dest/demo.svga',
      'path/to/dest/demo.htm',
      'path/to/dest/demo.ttf',
      'path/to/dest/demo.woff'
    ];
    const falseExamples = [
      'path/to/dest/demo.js',
      'path/to/dest/demo.css',
      'path/to/dest/demo.png',
      'path/to/dest/demo.jpg',
      'path/to/dest/demo.jpeg',
      'path/to/dest/demo.bak',
      'path/to/dest/demo.bmp',
      'path/to/dest/demo.psd'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.IS_MAIN_REMOTE)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.IS_MAIN_REMOTE)).equal(null);
    });
    done();
  });

  it('frp.REG.JS_REMOTE_ASSETS_URL', (done) => {
    const trueExamples = [
      'var a = "//yyweb.static.com/assets/demo.js"',
      'var a = \'//yyweb.static.com/assets/demo.js\'',
      'var a = "http://yyweb.static.com/assets/demo.js"',
      'var a = "https://yyweb.static.com/assets/demo.js"',
      'var a = "/assets/demo.js"'
    ];
    const falseExamples = [
      'var a = "//yyweb.static.com/" + "assets/demo.js"',
      'var a = "//yyweb.static.com/assets/demo"',
      'var a = "//yyweb.static.com/assets/demo.jpegg"',
      'var a = "yyweb.static.com/assets/demo.js"'
    ];
    trueExamples.forEach((ctx) => {
      expect(ctx.match(REG.JS_REMOTE_ASSETS_URL)).not.equal(null);
    });
    falseExamples.forEach((ctx) => {
      expect(ctx.match(REG.JS_REMOTE_ASSETS_URL)).equal(null);
    });
    done();
  });
});