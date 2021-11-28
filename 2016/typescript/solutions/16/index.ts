export const parseInput = (input: string): string => input;

export const part1 = (input: string): string => genChecksum(genData(input, 272));
export const part2 = (input: string): string => genChecksum(genData(input, 35651584));

const genData = (initial: string, len: number): string => {
  let data = initial;

  while (data.length < len) {
    data += '0' + data.split('').map(c => 1 - +c).reverse().join('');
  }

  return data.substr(0, len);
};

const genChecksum = (data: string): string => {
  let checksum = data;

  do {
    let loopChecksum = '';

    for (let i = 0; i < checksum.length; i += 2) {
      loopChecksum += checksum[i] === checksum[i + 1] ? 1 : 0;
    }

    checksum = loopChecksum;
  } while (~checksum.length & 1);

  return checksum;
};
