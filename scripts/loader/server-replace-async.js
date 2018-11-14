Object.defineProperty(exports, "__esModule", {value: true});
function loader(source) {
  return source.replace(/import\s*\(/gm, "require(");
}
exports.default = loader;
