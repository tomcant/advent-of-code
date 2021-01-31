enum Marker {
  Open = '(',
  Close = ')'
}

class Node {
  constructor(readonly value: string, readonly repeat: number = 1) {}

  public isLeaf(): boolean {
    return -1 === this.value.indexOf(Marker.Open);
  }

  public charAt(idx: number): string {
    return this.value[idx];
  }

  get length(): number {
    return this.value.length;
  }
}

const countDecompressedChars = (node: Node, maxDepth: number = Infinity): number => {
  return (function count(node, depth = 0) {
    if (node.isLeaf() || depth === maxDepth) {
      return node.length;
    }

    return findChildNodes(node).reduce(
      (cnt, child) => cnt + child.repeat * count(child, depth + 1),
      0
    );
  })(node);
};

const findChildNodes = (node: Node): Node[] => {
  const nodes: Node[] = [];
  let stringNode: string = '';

  for (let i = 0; i < node.length; ) {
    if (Marker.Open !== node.charAt(i)) {
      stringNode += node.charAt(i);
      continue;
    }

    if (stringNode.length > 0) {
      nodes.push(new Node(stringNode));
      stringNode = '';
    }

    const bracket = node.value.substr(i, node.value.indexOf(Marker.Close, i) - i + 1);
    const [, count, repeat] = bracket.match(/(\d+)x(\d+)/);

    nodes.push(new Node(node.value.substr(i + bracket.length, +count), +repeat));

    i += bracket.length + +count;
  }

  return nodes;
};

export const part1 = (input: Node): number => countDecompressedChars(input, 1);
export const part2 = (input: Node): number => countDecompressedChars(input);

export const parseInput = (input: string): Node => new Node(input);
