import Queue from '../../utils/queue';

enum ComponentType {
  Microchip = 'm',
  Generator = 'g'
}

type Component = {
  element: string,
  type: ComponentType
};

type Floor = Component[];
type Elevator = [Component, Component?];

type Position = {
  floors: Floor[],
  currFloorIdx: number
};

type Node = {
  pos: Position,
  steps: number
};

const findShortestPath = (floors: Floor[]): number => {
  const startPos = { floors, currFloorIdx: 0 };
  const history = new Set<string>([hashPosition(startPos)]);
  const queue = new Queue<Node>([{ pos: startPos, steps: 0 }]);

  while (!queue.isEmpty()) {
    const { pos, steps } = queue.dequeue();

    if (reachedTopFloorWithAllComponents(pos)) {
      return steps;
    }

    for (const nextPosition of getNextPositions(pos)) {
      const hash = hashPosition(nextPosition);

      if (!history.has(hash)) {
        history.add(hash);

        queue.enqueue({
          pos: nextPosition,
          steps: steps + 1
        });
      }
    }
  }
};

const getNextPositions = ({ floors, currFloorIdx }: Position): Position[] => {
  const nextPositions = [];

  for (const combination of getElevatorCombinations(floors[currFloorIdx])) {
    for (const nextFloorIdx of getAdjFloorIdxs({ floors, currFloorIdx })) {
      const nextPosition = {
        floors: cloneFloors(floors),
        currFloorIdx: nextFloorIdx
      };

      nextPosition.floors[currFloorIdx] = floors[currFloorIdx].filter(
        component => !combination.some(c => areComponentsEqual(c, component))
      );

      nextPosition.floors[nextFloorIdx].push(...combination);

      if (isPositionLegal(nextPosition)) {
        nextPositions.push(nextPosition);
      }
    }
  }

  return nextPositions;
};

const getElevatorCombinations = (floor: Floor): Elevator[] => {
  const combinations = floor.map(component => [component] as Elevator);

  for (let i = 0; i < floor.length; ++i) {
    for (let j = i + 1; j < floor.length; ++j) {
      combinations.push([floor[i], floor[j]]);
    }
  }

  return combinations;
};

const getAdjFloorIdxs = (pos: Position): number[] => {
  const nextFloorIdxs = [];

  if (!isOnTopFloor(pos)) {
    nextFloorIdxs.push(pos.currFloorIdx + 1);
  }

  if (!isOnBottomFloor(pos)) {
    nextFloorIdxs.push(pos.currFloorIdx - 1);
  }

  return nextFloorIdxs;
};

const isPositionLegal = ({ floors }: Position): boolean =>
  !floors.some(floor => {
    const generators = floor.filter(isGenerator);

    if (generators.length === 0) {
      return false;
    }

    return floor.filter(isMicrochip).some(
      microchip => !generators.some(generator => areElementsEqual(generator, microchip))
    );
  });

const hashPosition = ({ floors, currFloorIdx }: Position): string =>
  JSON.stringify([
    currFloorIdx,
    floors.map(floor => [
      floor.filter(isGenerator).length,
      floor.filter(isMicrochip).length
    ])
  ]);

const cloneFloors = (floors: Floor[]): Floor[] => floors.map(floor => floor.map(component => ({...component})));

const isGenerator = (component: Component): boolean => ComponentType.Generator === component.type;
const isMicrochip = (component: Component): boolean => ComponentType.Microchip === component.type;

const areElementsEqual = (c1: Component, c2: Component): boolean => c1.element === c2.element;
const areTypesEqual = (c1: Component, c2: Component): boolean => c1.type === c2.type;
const areComponentsEqual = (c1: Component, c2: Component): boolean => areElementsEqual(c1, c2) && areTypesEqual(c1, c2);

const isOnBottomFloor = ({ currFloorIdx }: Position): boolean => 0 === currFloorIdx;
const isOnTopFloor = ({ floors, currFloorIdx }: Position): boolean => floors.length - 1 === currFloorIdx;

const reachedTopFloorWithAllComponents = (pos: Position): boolean =>
  isOnTopFloor(pos) && pos.floors.filter(floor => floor.length > 0).length === 1;

export const part1 = (floors: Floor[]): number => findShortestPath(floors);

export const part2 = (floors: Floor[]): number => {
  floors[0].push(...[
    { element: 'elerium', type: ComponentType.Generator },
    { element: 'elerium', type: ComponentType.Microchip },
    { element: 'dilithium', type: ComponentType.Generator },
    { element: 'dilithium', type: ComponentType.Microchip }
  ]);

  return findShortestPath(floors);
};

export const parseInput = (input: string): Floor[] =>
  input.split('\n').map(line => {
    const components = [];
    const pattern = /(\w+)(?:-\w+)?\s([mg])/g;

    let match;
    while (match = pattern.exec(line)) {
      components.push({ element: match[1], type: match[2] });
    }

    return components;
  });
