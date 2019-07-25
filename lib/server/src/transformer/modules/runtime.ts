// export default function(babel) {
//   const { types: t } = babel;

//   const exportedValues = [];
//   const bindings = {};

//   return {
//     name: 'ast-transform',
//     visitor: {
//       ExportDefaultDeclaration(p) {
//         addFramework(t)(p);

//         if (p.get('declaration').isObjectExpression()) {
//           p.scope.push({ id: bindings.storyMeta, init: p.node.declaration, kind: 'const' });
//           p.replaceWith(t.exportDefaultDeclaration(bindings.storyMeta));
//         }
//       },

//       ExportNamedDeclaration(path) {
//         if (path.get('declaration').isDeclaration()) {
//           path
//             .get('declaration')
//             .get('declarations')
//             .reduce((acc, d) => {
//               const id = d.get('id');

//               if (id.isIdentifier()) {
//                 acc.push(id.node.name);
//               } else if (id.isObjectPattern()) {
//                 id.get('properties').forEach(prop => {
//                   if (prop.isObjectProperty()) {
//                     acc.push(prop.node.value.name);
//                   }
//                 });
//               } else if (id.isArrayPattern()) {
//                 id.get('elements').forEach(element => {
//                   if (element.isIdentifier()) {
//                     acc.push(element.node.name);
//                   }
//                 });
//               } else {
//                 console.log('UNKNOWN');
//               }

//               return acc;
//             }, exportedValues);
//         } else if (path.get('specifiers').length) {
//           path.get('specifiers').reduce((acc, i) => {
//             acc.push(i.node.local.name);
//           }, exportedValues);
//         }
//       },

//       Program: {
//         enter(p) {
//           bindings.add = p.scope.generateUidIdentifier('add');
//           bindings.storyMeta = p.scope.generateUidIdentifier('storyMeta');
//         },
//         exit(p) {
//           const hasStoryMeta = p.scope.bindings[bindings.storyMeta.name];

//           p.unshiftContainer('body', [
//             t.importDeclaration(
//               [t.importSpecifier(bindings.add, bindings.add)],
//               t.stringLiteral('@storybook/runtime')
//             ),
//           ]);
//           p.pushContainer('body', [
//             t.expressionStatement(
//               t.callExpression(bindings.add, [
//                 t.objectExpression(
//                   [
//                     t.objectProperty(t.identifier('module'), t.identifier('module'), false, true),
//                     t.objectProperty(
//                       t.identifier('stories'),
//                       t.arrayExpression(exportedValues.map(v => t.identifier(v)))
//                     ),
//                     hasStoryMeta ? t.spreadElement(bindings.storyMeta) : false,
//                   ].filter(Boolean)
//                 ),
//               ])
//             ),
//           ]);
//         },
//       },
//     },
//   };
// }

// const parameterKey = 'parameters';
// const framework = 'f';
// const addFramework = t => p => {
//   const declaration = p.get('declaration');

//   if (declaration.isObjectExpression()) {
//     const hasParameterObject = !!declaration
//       .get('properties')
//       .find(p1 => p1.isObjectProperty() && p1.node.key.name === parameterKey);

//     if (hasParameterObject) {
//       // ADD property with key 'framework' with value of framework to existing key parameters
//       declaration.get('properties').forEach(p1 => {
//         if (p1.isObjectProperty() && p1.node.key.name === parameterKey) {
//           const value = p1.get('value');
//           if (value.isObjectExpression()) {
//             const parameterProperties = value.get('properties');
//             const found = parameterProperties.find(p2 => p2.key === 'framework');

//             if (!found) {
//               value.replaceWith(
//                 t.objectExpression([
//                   ...parameterProperties.map(i => i.node),
//                   t.objectProperty(t.identifier('framework'), t.stringLiteral(framework)),
//                 ])
//               );
//             }
//           }
//         }
//       });
//     } else {
//       // ADD a new object on key 'parameters'
//       p.get('declaration')
//         .get('properties')
//         .find(i => t.isObjectProperty(i.node))
//         .insertAfter(
//           t.objectProperty(
//             t.identifier(parameterKey),
//             t.objectExpression([
//               t.objectProperty(t.identifier('framework'), t.stringLiteral(framework)),
//             ])
//           )
//         );
//     }
//   }
// };
