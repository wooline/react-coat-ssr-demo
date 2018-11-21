Object.defineProperty(exports, "__esModule", {value: true});
function loader(source) {
  if (this.resourcePath.endsWith("model.ts")) {
    let arr = source.match(/^(\s*).*\bclass [^<]+<(\w+)[\s\S]+?{([\s\S]+(^\s+)(@reducer\b|@effect\b)[\s\S]+)^\1}/m);
    if (arr) {
      const state = arr[2];
      const content = arr[3];
      const split = arr[4];

      let reg = new RegExp(`@reducer\\b[^)]+\\)(?!\\s*:\\s*${state}\\b)`, "m");
      arr = content.match(reg);
      if (arr) {
        throw new Error(`\n @reducer can only be decorated the function with "${state}" returned:\n${arr[0]}`);
      }
      arr = content.match(/@effect\(([^(](?!async))+?\(/m);
      if (arr) {
        throw new Error(`\n @effect can only be decorated the "async" function:\n${arr[0]}`);
      }
      reg = new RegExp(`\\n(.(?!@reducer\\b|@effect\\b))*\\n${split}(?!private)\\w+.+`, "m");
      arr = content.match(reg);
      if (arr) {
        throw new Error(`\n All the public method must decorated by @reducer or @effect:\n${arr[0]}`);
      }
      arr = content.match(/(@reducer\b|@effect\()[^(]+(\w+)\s*\(/gm);
      if (arr) {
        reg = new RegExp(
          arr
            .map(
              str =>
                `this\\.${str
                  .substring(str.lastIndexOf(" ") + 1)
                  .replace(" ", "")
                  .replace("(", "\\(")}`
            )
            .join("|")
        );
        arr = source.match(reg);
        if (arr) {
          throw new Error(`\n @reducer or @effect handler cannot be called directly, use this.callSelf instead:\n${arr[0]}`);
        }
      }
    }
  }
  return source;
}
exports.default = loader;
