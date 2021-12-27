import PriorityQueue from "ts-priority-queue";

const ENERGY_COSTS = { A: 1, B: 10, C: 100, D: 1000 };
const ROOM_TO_HALL_INDEX = { A: 2, B: 4, C: 6, D: 8 };
const ROOM_HALL_INDEXES = Object.values(ROOM_TO_HALL_INDEX);

type Pod = "A" | "B" | "C" | "D";
type Cell = Pod | null;
type Room = Cell[];

type State = {
  hall: Cell[];
  rooms: Room[];
};

type SearchNode = {
  totalEnergy: number;
  state: State;
};

export const parseInput = (input: string): State => {
  const lines = input.split("\n").slice(2, 4);

  return {
    hall: emptyHall(),
    rooms: [
      [lines[1][3], lines[0][3]],
      [lines[1][5], lines[0][5]],
      [lines[1][7], lines[0][7]],
      [lines[1][9], lines[0][9]],
    ] as Room[],
  };
};

export const part1 = (initial: State): number => {
  const target = {
    hall: emptyHall(),
    rooms: toRooms("AA", "BB", "CC", "DD"),
  };

  return findLeastEnergy(initial, target);
};

export const part2 = (initial: State): number => {
  initial.rooms[0].splice(1, 0, "D", "D");
  initial.rooms[1].splice(1, 0, "B", "C");
  initial.rooms[2].splice(1, 0, "A", "B");
  initial.rooms[3].splice(1, 0, "C", "A");

  const target = {
    hall: emptyHall(),
    rooms: toRooms("AAAA", "BBBB", "CCCC", "DDDD"),
  };

  return findLeastEnergy(initial, target);
};

const findLeastEnergy = (initial: State, target: State): number => {
  const queue = new PriorityQueue<SearchNode>({
    comparator: (a, b) => a.totalEnergy - b.totalEnergy,
    initialValues: [{ state: initial, totalEnergy: 0 }],
  });
  const visited = new Set();
  const targetHash = hashState(target);
  const perRoom = target.rooms[0].length;

  while (queue.length > 0) {
    const { totalEnergy, state } = queue.dequeue();
    const hash = hashState(state);

    if (visited.has(hash)) {
      continue;
    }

    if (hash === targetHash) {
      return totalEnergy;
    }

    visited.add(hash);

    const nextStates = [
      ...findStatesFromHallPods(state, perRoom),
      ...findStatesFromRoomPods(state, perRoom),
    ];

    for (const [energy, nextState] of nextStates) {
      queue.queue({
        state: nextState,
        totalEnergy: totalEnergy + energy,
      });
    }
  }
};

const findStatesFromHallPods = (
  { hall, rooms }: State,
  perRoom: number
): [number, State][] => {
  const states = [];

  for (let idx = 0; idx < hall.length; ++idx) {
    if (!hall[idx]) continue;

    const pod = hall[idx];
    const roomIdx = pod.charCodeAt(0) - 65;
    const room = rooms[roomIdx];

    if (
      !canEnterRoom(pod, room, perRoom) ||
      !isHallClear(idx, ROOM_TO_HALL_INDEX[pod], hall)
    ) {
      continue;
    }

    const steps =
      Math.abs(idx - ROOM_TO_HALL_INDEX[pod]) + perRoom - room.length;

    states.push([
      steps * ENERGY_COSTS[pod],
      {
        hall: hall.map((h, i) => (i === idx ? null : h)),
        rooms: rooms.map((r, i) => (i === roomIdx ? [...r, pod] : r)),
      },
    ]);
  }

  return states;
};

const findStatesFromRoomPods = (
  state: State,
  perRoom: number
): [number, State][] => {
  const states = [];

  for (let idx = 0; idx < state.rooms.length; ++idx) {
    if (!state.rooms[idx].length) continue;

    states.push(
      ...findStatesFromRoomInDir(idx, -1, state, perRoom),
      ...findStatesFromRoomInDir(idx, 1, state, perRoom)
    );
  }

  return states;
};

const findStatesFromRoomInDir = (
  roomIdx: number,
  dir: number,
  state: State,
  perRoom: number
): [number, State][] => {
  const states = [];
  const rooms = state.rooms.map((r) => [...r]);
  const pod = rooms[roomIdx].pop();

  let pos = ROOM_HALL_INDEXES[roomIdx];
  let steps = perRoom - state.rooms[roomIdx].length;

  do {
    steps += 1;

    if (!ROOM_HALL_INDEXES.includes(pos)) {
      states.push([
        steps * ENERGY_COSTS[pod],
        { hall: state.hall.map((h, i) => (i === pos ? pod : h)), rooms },
      ]);
    }
  } while (state.hall[(pos += dir)] === null);

  return states;
};

const isHallClear = (from: number, to: number, hall: Cell[]): boolean => {
  const dir = to > from ? 1 : -1;

  while (from !== to) {
    if (hall[(from += dir)]) {
      return false;
    }
  }

  return true;
};

const canEnterRoom = (pod: Pod, room: Cell[], perRoom: number): boolean =>
  room.length < perRoom && room.filter((p) => p !== pod).length === 0;

const hashState = (state: State): string => JSON.stringify(state);

const emptyHall = () => Array(11).fill(null);

const toRooms = (...rooms): Room[] => rooms.map((r) => r.split(""));
