module.exports = source => source.replace(/import(\(.+?modules\/.+?\/views['"]\s*\))/gm, 'require$1');
