import { TraverseOptions, NodePath, VisitNode, VisitNodeFunction, Node } from '@babel/traverse';

interface GeneralCollector {
  [key: string]: VisitNode<{}, Node>[];
}

interface VisitNodeCollector {
  enter: VisitNodeFunction<{}, Node>[];
  exit: VisitNodeFunction<{}, Node>[];
}

export const visitorMerge = (...transforms: TraverseOptions[]): TraverseOptions => {
  const collector: GeneralCollector = {};
  transforms.forEach(item => {
    Object.entries(item).forEach(([k, v]) => {
      collector[k] = (collector[k] || []).concat(v);
    });
  }, {});

  return Object.entries(collector).reduce((acc, [key, list]) => {
    //
    const hasVisitNodeObject = !!list.find(i => typeof i !== 'function');
    const aa: VisitNodeCollector = {
      enter: [],
      exit: [],
    };

    if (hasVisitNodeObject) {
      const c = list.reduce((a, i) => {
        if (typeof i === 'function') {
          a.enter.push(i);
        } else {
          if (i.enter) {
            a.enter.push(i.enter);
          }
          if (i.exit) {
            a.exit.push(i.exit);
          }
        }

        return a;
      }, aa);
      const enter = function mergedEnter(p: NodePath<Node>, n: Node) {
        c.enter.forEach(f => {
          if (typeof f === 'function') {
            f.apply(this, [p, n]);
          }
        });
      };
      const exit = function mergedExit(p: NodePath<Node>, n: Node) {
        c.exit.forEach(f => {
          if (typeof f === 'function') {
            f.apply(this, [p, n]);
          }
        });
      };
      const v = Object.assign({}, c.enter.length ? { enter } : {}, c.exit.length ? { exit } : {});
      return { ...acc, [key]: v };
    }
    const fn = function merged(p: NodePath<Node>, n: Node) {
      list.forEach(f => {
        if (typeof f === 'function') {
          f.apply(this, [p, n]);
        }
      });
    };
    return { ...acc, [key]: fn };
  }, {});
};
