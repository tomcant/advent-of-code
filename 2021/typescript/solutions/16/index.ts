enum PacketType {
  Sum = 0,
  Product = 1,
  Minimum = 2,
  Maximum = 3,
  Literal = 4,
  GreaterThan = 5,
  LessThan = 6,
  EqualTo = 7,
}

type Packet = {
  version: number;
  type: PacketType;
  value?: number;
  packets?: Packet[];
  length: number;
};

enum LengthType {
  StringLength = 0,
  NumPackets = 1,
}

export const parseInput = (input: string): Packet =>
  parsePackets(
    [...input].reduce(
      (acc, hex) => acc + parseInt(hex, 16).toString(2).padStart(4, "0"),
      ""
    )
  )[0];

export const part1 = (packet: Packet): number => calcVersionSum(packet);
export const part2 = (packet: Packet): number => calcValue(packet);

const calcVersionSum = ({ version, packets }: Packet): number =>
  version + (packets || []).reduce((acc, p) => acc + calcVersionSum(p), 0);

const calcValue = ({ type, value, packets }: Packet): number => {
  switch (type) {
    case PacketType.Literal:
      return value;

    case PacketType.Sum:
      return packets.reduce((acc, p) => acc + calcValue(p), 0);

    case PacketType.Product:
      return packets.reduce((acc, p) => acc * calcValue(p), 1);

    case PacketType.Minimum:
      return Math.min(...packets.map((p) => calcValue(p)));

    case PacketType.Maximum:
      return Math.max(...packets.map((p) => calcValue(p)));

    case PacketType.GreaterThan:
      return calcValue(packets[0]) > calcValue(packets[1]) ? 1 : 0;

    case PacketType.LessThan:
      return calcValue(packets[0]) < calcValue(packets[1]) ? 1 : 0;

    case PacketType.EqualTo:
      return calcValue(packets[0]) === calcValue(packets[1]) ? 1 : 0;
  }
};

const parsePackets = (str: string, limit: number = Infinity): Packet[] => {
  const parsedPackets = [];
  let ptr = 0;

  const consume = (bits: number) => str.substr((ptr += bits) - bits, bits);
  const consumeInt = (bits: number) => binToDec(consume(bits));

  while (
    ptr < str.length &&
    parsedPackets.length < limit &&
    binToDec(str.substr(ptr)) > 0
  ) {
    const ptrAtIterStart = ptr;
    const version = consumeInt(3);
    const packetType = consumeInt(3);

    if (packetType === PacketType.Literal) {
      let literal = "";
      let part;

      do {
        part = consume(5);
        literal += part.substr(1);
      } while (part[0] !== "0");

      parsedPackets.push({
        version,
        type: PacketType.Literal,
        value: binToDec(literal),
        length: ptr - ptrAtIterStart,
      });

      continue;
    }

    const lengthType = consumeInt(1);
    let subPackets;

    switch (lengthType) {
      case LengthType.StringLength:
        const length = consumeInt(15);
        subPackets = parsePackets(consume(length));
        break;

      case LengthType.NumPackets:
        const numPackets = consumeInt(11);
        subPackets = parsePackets(str.substr(ptr), numPackets);
        ptr += subPackets.reduce((acc, { length }) => acc + length, 0);
        break;
    }

    parsedPackets.push({
      version,
      type: packetType,
      packets: subPackets,
      length: ptr - ptrAtIterStart,
    });
  }

  return parsedPackets;
};

const binToDec = (bits: string): number => parseInt(bits, 2);
