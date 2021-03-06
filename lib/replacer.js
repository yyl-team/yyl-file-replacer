const querystring = require('querystring');

const replacer = {
  REG: {
    HTML_PATH_REG: /(src|href|data-main|data-original)(\s*=\s*)(['"])([^'"]*)(["'])/ig,
    HTML_SCRIPT_REG: /(<script[^>]*>)([\w\W]*?)(<\/script>)/ig,
    HTML_IGNORE_REG: /^(about:|data:|javascript:|#|\{\{)/,
    HTML_SCRIPT_TEMPLATE_REG: /type\s*=\s*['"]text\/html["']/,
    HTML_ALIAS_REG: /^(\{\$)(\w+)(\})/g,
    HTML_IS_ABSLUTE: /^(\/$|\/[^/])/,
    HTML_STYLE_TAG_REG: /(style)(\s*=\s*)(['"])([^'"]*)(["'])/ig,

    HTML_STYLE_REG: /(<style[^>]*>)([\w\W]*?)(<\/style>)/ig,
    HTML_SRC_COMPONENT_JS_REG: /^\.\.\/components\/[pt]-[a-zA-Z0-9-]+\/[pt]-([a-zA-Z0-9-]+).js/g,

    HTML_SRC_COMPONENT_IMG_REG: /^\.\.\/(components\/[pwrt]-[a-zA-Z0-9-]+\/images)/g,

    CSS_PATH_REG: /(url\s*\(['"]?)([^'"]*?)(['"]?\s*\))/ig,
    CSS_PATH_REG2: /(src\s*=\s*['"])([^'" ]*?)(['"])/ig,
    CSS_IGNORE_REG: /^(about:|data:|javascript:|#|\{\{)/,
    CSS_IS_ABSLURE: /^(\/$|\/[^/])/,

    JS_DISABLE_AMD: /\/\*\s*amd\s*:\s*disabled[; ]*\*\//,
    JS_EXCLUDE: /\/\*\s*exclude\s*:([^*]+)\*\//g,
    JS_SUGAR__URL: /__url\s*\(\s*(['"])([^'"]*)(["'])\s*\)/g,
    JS_SUGAR__HTML: /__html\s*\(\s*(['"])([^'"]*)(["'])\s*\)/g,
    JS_REMOTE_ASSETS_URL: /(['"])(http[s]?:|\/\w|\/\/\w)([^'"]*)(\.\w{1,4})(["'])/g,

    IS_HTTP: /^(http[s]?:)|(\/\/\w)/,

    IS_MAIN_REMOTE: /\.(html|tpl|svga|htm|woff|ttf)$/
  },

  // for html
  htmlPathMatch(ctx, replaceHandle) {
    const self = replacer;
    let content = ctx;

    // 提取 script 标签
    content = content
      .replace(self.REG.HTML_SCRIPT_REG, (str, $1, $2, $3) => {
        // tpl 不作处理
        if ($1.match(self.REG.HTML_SCRIPT_TEMPLATE_REG)) {
          return str;

        // 处理 url 部分 并且隔离 script
        } else {
          return `${$1}${querystring.escape(self.jsPathMatch($2, replaceHandle))}${$3}`;
        }
      })
      // 隔离 style 标签
      .replace(self.REG.HTML_STYLE_REG, (str, $1, $2, $3) => {
        return $1 + querystring.escape(self.cssPathMatch($2, replaceHandle)) + $3;
      })
      // 匹配 html 中的 style 标签内容
      .replace(self.REG.HTML_STYLE_TAG_REG, (str, $1, $2, $3, $4, $5) => {
        const iPath = self.cssPathMatch($4, replaceHandle);
        return `${$1}${$2}${$3}${iPath}${$5}`;
      })
      // 匹配 html 中的 url
      .replace(self.REG.HTML_PATH_REG, (str, $1, $2, $3, $4, $5) => {
        const iPath = replaceHandle($4, 'html-path');
        return `${$1}${$2}${$3}${iPath}${$5}`;
      })
      // 取消隔离 script 内容
      .replace(self.REG.HTML_SCRIPT_REG, (str, $1, $2, $3) => {
        if ($1.match(self.REG.HTML_SCRIPT_TEMPLATE_REG)) {
          return str;
        } else {
          return $1 + querystring.unescape($2) + $3;
        }
      })
      // 取消隔离 style 标签
      .replace(self.REG.HTML_STYLE_REG, (str, $1, $2, $3) => {
        return $1 + querystring.unescape($2) + $3;
      });

    return content;
  },

  // for html
  htmlPathMatchLegacy(ctx, replaceHandle) {
    const self = replacer;
    let content = ctx;

    // 提取 script 标签
    content = content
      .replace(self.REG.HTML_SCRIPT_REG, (str, $1, $2, $3) => {
        // tpl 不作处理
        if ($1.match(self.REG.HTML_SCRIPT_TEMPLATE_REG)) {
          return str;

        // 处理 url 部分 并且隔离 script
        } else {
          return `${$1}${querystring.escape(self.jsPathMatchLegacy($2, replaceHandle))}${$3}`;
        }
      })
      // 隔离 style 标签
      .replace(self.REG.HTML_STYLE_REG, (str, $1, $2, $3) => {
        return $1 + querystring.escape(self.cssPathMatch($2, replaceHandle)) + $3;
      })
      // 匹配 html 中的 style 标签内容
      .replace(self.REG.HTML_STYLE_TAG_REG, (str, $1, $2, $3, $4, $5) => {
        const iPath = self.cssPathMatch($4, replaceHandle);
        return `${$1}${$2}${$3}${iPath}${$5}`;
      })
      // 匹配 html 中的 url
      .replace(self.REG.HTML_PATH_REG, (str, $1, $2, $3, $4, $5) => {
        const iPath = replaceHandle($4, 'html-path');
        return `${$1}${$2}${$3}${iPath}${$5}`;
      })
      // 取消隔离 script 内容
      .replace(self.REG.HTML_SCRIPT_REG, (str, $1, $2, $3) => {
        if ($1.match(self.REG.HTML_SCRIPT_TEMPLATE_REG)) {
          return str;
        } else {
          return $1 + querystring.unescape($2) + $3;
        }
      })
      // 取消隔离 style 标签
      .replace(self.REG.HTML_STYLE_REG, (str, $1, $2, $3) => {
        return $1 + querystring.unescape($2) + $3;
      });

    return content;
  },

  // for js
  jsPathMatch(ctx, replaceHandle) {
    const self = replacer;
    let scriptCnt = ctx;
    scriptCnt = scriptCnt
      .replace(self.REG.JS_SUGAR__HTML, (str, $1, $2, $3) => {
        return `${$1}${replaceHandle($2, '__html', $1)}${$3}`;
      }).replace(self.REG.JS_SUGAR__URL, (str, $1, $2, $3) => {
        return `${$1}${replaceHandle($2, '__url', $1)}${$3}`;
      }).replace(self.REG.JS_REMOTE_ASSETS_URL, (str, $1, $2, $3, $4, $5) => {
        return `${$1}${replaceHandle(`${$2}${$3}${$4}`, 'js-path', $2)}${$5}`;
      });
    return scriptCnt;
  },

  jsPathMatchLegacy(ctx, replaceHandle) {
    const self = replacer;
    let scriptCnt = ctx;
    scriptCnt = scriptCnt
      .replace(self.REG.JS_SUGAR__HTML, (str, $1, $2, $3) => {
        return `${$1}${replaceHandle($2, '__html', $1)}${$3}`;
      }).replace(self.REG.JS_SUGAR__URL, (str, $1, $2) => {
        return replaceHandle($2, '__url', $1);
      }).replace(self.REG.JS_REMOTE_ASSETS_URL, (str, $1, $2, $3, $4, $5) => {
        return `${$1}${replaceHandle(`${$2}${$3}${$4}`, 'js-path', $2)}${$5}`;
      });
    return scriptCnt;
  },

  // for css
  cssPathMatch(ctx, replaceHandle) {
    const self = replacer;
    let cssCnt = ctx;
    const handle = (str, $1, $2, $3) => {
      return `${$1}${replaceHandle($2, 'css-path')}${$3}`;
    };
    cssCnt = cssCnt
      .replace(self.REG.CSS_PATH_REG, handle)
      .replace(self.REG.CSS_PATH_REG2, handle);

    return cssCnt;
  }
};

module.exports = replacer;
