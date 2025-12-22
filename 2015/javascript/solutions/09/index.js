const { readLines } = require('../../utils/file-io');

const findDistances = graph => {
  let [smallest, greatest] = [Infinity, -Infinity];

  for (let node in graph) {
    const distances = travelTo(node, graph);

    if (distances.smallest < smallest) {
      smallest = distances.smallest;
    }

    if (distances.greatest > greatest) {
      greatest = distances.greatest;
    }
  }

  return { smallest, greatest };
};

const travelTo = (node, graph, visited = []) => {
  visited.push(node);

  const unvisited = Object.keys(graph[node]).filter(node => !visited.includes(node));

  if (unvisited.length === 0) {
    return { smallest: 0, greatest: 0 };
  }

  let [smallest, greatest] = [Infinity, -Infinity];

  for (let nextNode of unvisited) {
    const distanceToNextNode = graph[node][nextNode];
    const distances = travelTo(nextNode, graph, visited.slice());

    if (distances.smallest + distanceToNextNode < smallest) {
      smallest = distances.smallest + distanceToNextNode;
    }

    if (distances.greatest + distanceToNextNode > greatest) {
      greatest = distances.greatest + distanceToNextNode;
    }
  }

  return { smallest, greatest };
};

const graph = {};

readLines('input.txt').forEach(line => {
  const [, from, to, distance] = line.match(/(.+) to (.+) = (.+)/);

  graph[from] = graph[from] || {};
  graph[to] = graph[to] || {};

  graph[from][to] = graph[to][from] = parseInt(distance);
});

const distances = findDistances(graph);

console.log('Part 1:', distances.smallest);
console.log('Part 2:', distances.greatest);
