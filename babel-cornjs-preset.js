const p = require('path'); // Ensure you're using Node.js's path module

module.exports = function (babel) {
  const { types: t } = babel;

  return {
    visitor: {
      Program(path, state) {
        const filename = state.file.opts.filename;
        const relativePath = "./" + p.relative(
          p.dirname(filename),
          p.resolve(__dirname, './corn.js/corn.js')
        );

        // Check if the import statement already exists
        const importDeclarationExists = path.node.body.some(node => {
          return t.isImportDeclaration(node) && node.source.value === relativePath;
        });

        if (!importDeclarationExists) {
          // Inject import statement for createElement at the top of the file
          const importDeclaration = t.importDeclaration(
            [t.importSpecifier(t.identifier('createElement'), t.identifier('createElement'))],
            t.stringLiteral(relativePath)
          );

          path.unshiftContainer('body', importDeclaration);
        }

        // Transform import statements ending with .jsx to .js
        path.node.body.forEach(node => {
          if (t.isImportDeclaration(node)) {
            const importPath = node.source.value;
            if (importPath.endsWith('.jsx')) {
              node.source = t.stringLiteral(importPath.replace(/\.jsx$/, '.js'));
            }
          }
        });
      },
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const tagName = openingElement.name.name;

        // Process attributes
        const attributes = openingElement.attributes.map(attr => {
          let attrName = attr.name.name;
          const attrValue = t.isJSXExpressionContainer(attr.value)
            ? attr.value.expression
            : attr.value;

          // Convert className to class
          if (attrName === 'className') {
            attrName = 'class';
          }
          return t.objectProperty(t.identifier(attrName), attrValue);
        });

        // Process children
        const children = path.node.children.map(child => {
          if (t.isJSXText(child)) {
            return t.stringLiteral(child.value.trim());
          } else if (t.isJSXExpressionContainer(child)) {
            return child.expression;
          } else {
            return child;
          }
        }).filter(child => child.value !== '');

        // Check if the tagName corresponds to a known component
        const isComponent = openingElement.name.type === 'JSXIdentifier' && /^[A-Z]/.test(tagName);

        // If it's a component, transform it to a function call
        const customElement = isComponent
          ? t.callExpression(t.identifier(tagName), [
            t.objectExpression(attributes),
            ...children
          ])
          : t.callExpression(
            t.identifier('createElement'),
            [
              t.stringLiteral(tagName),
              t.objectExpression(attributes),
              ...children
            ]
          );

        // Replace the JSX element with the customElement call
        path.replaceWith(customElement);
      }
    }
  };
};
