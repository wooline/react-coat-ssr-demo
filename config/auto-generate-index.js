const loaderUtils = require('loader-utils');
const path = require('path');

function loader(source) {
  const options = loaderUtils.getOptions(this);
  const src = path.relative(options.root, this.resourcePath);
  if (/^[^\\/]+$/.test(src)) {
    let result = source.match(/generateServer\s*\((.*)\)/m);
    if (result) {
      let [appModuleName, ssrInitStoreKey] = result[1].split(',').map(opt => opt.trim().replace(/['"]/g, ''));
      appModuleName = appModuleName || 'app';
      ssrInitStoreKey = ssrInitStoreKey || 'reactCoatInitStore';
      const content = `import * as app from "modules/app";
      import * as photos from "modules/photos";
      import * as videos from "modules/videos";
      import {renderApp} from "react-coat-pkg";
      
      const modules = {app, photos, videos};
      
      export default function render(path: string) {
        return renderApp(
          [path], 
          {
            getModule: (name: string) => {
            return modules[name];
            }
          },
          "${appModuleName}",
          "${ssrInitStoreKey}"
        );
      }
      `;
      console.log(content);
      return content;
    }
    result = source.match(/generateClient\s*\((.*)\)/m);
    if (result) {
      let [appModuleName, containerId, moduleImportType, ssrInitStoreKey] = result[1].split(',').map(opt => opt.trim().replace(/['"]/g, ''));
      appModuleName = appModuleName || 'app';
      containerId = containerId || 'root';
      moduleImportType = moduleImportType || 'async';
      ssrInitStoreKey = ssrInitStoreKey || 'reactCoatInitStore';
      let getModule = '';
      let importModules = '';
      if (moduleImportType === 'async') {
        getModule = 'return import(/* webpackChunkName: "module-[request]", webpackInclude: /[/\\\\]modules[/\\\\]\\w+[/\\\\]index.(js|ts)$/ */ "modules/"+name+"/");';
      } else {
        importModules = `import * as app from "modules/app";
        import * as photos from "modules/photos";
        import * as videos from "modules/videos";`;
        getModule = 'return modules[name];';
      }
      const content = `import {buildApp} from "react-coat-pkg";
      ${importModules}
      
      buildApp(
        {
          moduleImportType: "${moduleImportType}",
          getModule: (name: string) => {${getModule}},
        },
        "${appModuleName}",
        "${containerId}",
        "${ssrInitStoreKey}"
      );
      `;
      console.log(content);
      return content;
    }
  }
  return source;
}
exports.default = loader;
