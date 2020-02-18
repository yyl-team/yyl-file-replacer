# yyl-file-replacer
a file replace plugin for yyl

## 安装
```bash
npm i yyl-file-replacer --save
```

## 引入
```js
const replacer = require('yyl-file-replacer')
```
## usage
### htmlPathMatch
```typescript
enum MatchType {
  CSS_PATH = 'css-path',
  JS_PATH = 'js-path',
  HTML_PATH = 'html-path'
}
interface Replacer {
  htmlPathMatch(ctx: string, handle: (matchUrl: string, type: MatchType) => string): string
}
```

#### example
```javascript
const { htmlPathMatch } = require('yyl-file-replacer')
const htmlStr = `
  <link rel="stylesheet" href="./link-href/1.css" type="text/css">
`
const r = []
htmlPathMatch(htmlStr, (matchUrl, type) => {
  r.push(matchUrl)
})
console.log(r) // [./link-href/1.css]
```

### jsPathMatch
```typescript
interface Replacer {
  jsPathMatch(ctx: string, handle: (matchUrl: string, type: MatchType.JS_PATH) => string): string
}
```
#### example
```javascript
const { jsPathMatch } = require('yyl-file-replacer')
const jsStr = `
  const a = __url('path/to/js')
  const b = __html('path/to/html')
`
const r = []
jsPathMatch(jsStr, (url, type, q) => {
  r.push({url, type, q})
)
console.log(r) // [{ url: 'path/to/js', type: '__url', q: '\''}, { url: 'path/to/html', type: '__html', q: '\''}]
```

### cssPathMatch
```typescript
interface Replacer {
  cssPathMatch(ctx: string, handle: (matchUrl: string, type: MatchType.CSS_PATH) => string): string
}
```
#### example
```javascript
const { cssPathMatch } = require('yyl-file-replacer')
const cssStr = `
  body { background: url(path/to/a) }
`
const r = []
cssPathMatch(cssStr, (matchUrl, type) => {
  r.push(matchUrl)
)
console.log(r) // [path/to/a]
```


## 版本信息
[这里](./history.md)
