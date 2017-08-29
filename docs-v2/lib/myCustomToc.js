// import slug from 'remark-slug';
// import util from 'mdast-util-toc';

// const simplifyPocAst = node => {
//   if (node.ordered === false) {
//     node.ordered = true;
//   }
//   if (node.children) {
//     node.children = node.children.map(simplifyPocAst);
//   }
//   if (node.loose === false) {
//     node.loose = true;
//   }
//   return node;
// };

// export default function toc(options) {
//   const settings = options || {};
//   const heading = settings.heading || 'toc|table[ -]of[ -]contents?';
//   const depth = settings.maxDepth || 6;
//   const tight = settings.tight;

//   this.use(slug);

//   function transformer(node) {
//     const { map: data, index, endIndex } = util(node, {
//       // heading,
//       maxDepth: depth,
//       tight,
//     });

//     if (!data) {
//       return;
//     }
//     const map = {
//       type: 'ReactComponent',
//       data: {
//         hName: 'component',
//         hProperties: {
//           component: 'Toc',
//         },
//       },
//       children: [...simplifyPocAst(data).children],
//       options: {
//         component: 'Toc',
//       },
//     };

//     if (index >= 0) {
//       node.children = [].concat(node.children.slice(0, index), map, node.children.slice(endIndex));
//     } else {
//       node.children = [].concat(map).concat(node.children);
//     }
//   }

//   return transformer;
// }
