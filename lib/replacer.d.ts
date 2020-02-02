enum MatchType {
  CSS_PATH = 'css-path',
  JS_PATH = 'js-path',
  HTML_PATH = 'html-path'
}

interface Replacer {
  REG: {
    HTML_PATH_REG: RegExp
    HTML_SCRIPT_REG: RegExp
    HTML_IGNORE_REG: RegExp
    HTML_SCRIPT_TEMPLATE_REG: RegExp
    HTML_ALIAS_REG: RegExp
    HTML_IS_ABSLUTE: RegExp
    HTML_STYLE_TAG_REG: RegExp
    HTML_STYLE_REG: RegExp
    HTML_SRC_COMPONENT_JS_REG: RegExp
    HTML_SRC_COMPONENT_IMG_REG: RegExp

    CSS_PATH_REG: RegExp
    CSS_PATH_REG2: RegExp
    CSS_IGNORE_REG: RegExp
    CSS_IS_ABSLURE: RegExp

    JS_DISABLE_AMD: RegExp
    JS_EXCLUDE: RegExp
    JS_SUGAR__URL: RegExp
    JS_REMOTE_ASSETS_URL: RegExp

    IS_HTTP: RegExp
    IS_MAIN_REMOTE: RegExp
  }
  /** html replacer */
  htmlPathMatch(ctx: string, handle: (matchUrl: string, type: MatchType) => string): string
  /** js replacer */
  jsPathMatch(ctx: string, handle: (matchUrl: string, type: MatchType.JS_PATH) => string): string
  /** css replacer */
  cssPathMatch(ctx: string, handle: (matchUrl: string, type: MatchType.CSS_PATH) => string): string
}

declare const replacer: Replacer
export = replacer