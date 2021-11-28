type Room = {
  name: string,
  sector: number,
  checksum: string,
};

export const parseInput = (input: string): Room[] =>
  input.split('\n').map(line => {
    const [, name, sector, checksum] = line.match(/(.+)-(\d+)\[(\w+)]/);
    return { name, sector: +sector, checksum };
  });

export const part1 = (rooms: Room[]): number =>
  rooms.reduce((sum, room) => sum + (isRoomReal(room) && room.sector), 0);

export const part2 = (rooms: Room[]): number => {
  for (const room of rooms) {
    if (!isRoomReal(room)) {
      continue;
    }

    let decryptedName = '';

    for (const char of room.name) {
      decryptedName += '-' === char ? ' ' :
        String.fromCharCode((char.charCodeAt(0) - 97 + room.sector % 26) % 26 + 97);
    }

    if ('northpole object storage' === decryptedName) {
      return room.sector;
    }
  }
};

const isRoomReal = (room: Room): boolean => {
  let lastChar, lastCount;

  for (const char of room.checksum) {
    const count = room.name.match(RegExp(char, 'g'))?.length;

    if (!count || count > lastCount || count === lastCount && char.charCodeAt(0) < lastChar.charCodeAt(0)) {
      return false;
    }

    lastChar = char;
    lastCount = count;
  }

  return true;
};
