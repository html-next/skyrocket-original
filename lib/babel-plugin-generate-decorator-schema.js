const path = require('path');

function generateDecoratorSchema() {

  return {
    name: "generate-decorator-schema",

    visitor: {
      Program: {
        enter: function(path, state) {
          const schemaStorage = process.__skyrocketWorkerSchemas;
          const workerPrefix = state.opts.workerPrefix;
          const fileName = path.scope.hub.file.opts.filename;
          const isParsingFile = fileName.indexOf(workerPrefix) === 0;

          if (isParsingFile) {
            let moduleName = fileName
              .substr(workerPrefix.length);
            moduleName = moduleName.substr(0, moduleName.length - 3);
            let activeSchema = schemaStorage[moduleName] = {};

            path.traverse({
              ClassDeclaration: function(path) {
                const className = path.node.id.name;

                if (activeSchema.className) {
                  throw new Error(`Only one class per worker module allowed, found ${activeSchema.className} and ${className} in ${fileName}`);
                }

                activeSchema.className = className;
              },
              Decorator: function(path) {
                const type = path.node.expression.name;
                const key = path.scope.block.key.name;

                activeSchema[type] = activeSchema[type] || [];
                activeSchema[type].push(key);
              },
            });
          }
        },
      },
    }
  };
}

generateDecoratorSchema.baseDir = function() {
  return path.join(__dirname, '../');
};

module.exports = generateDecoratorSchema;
