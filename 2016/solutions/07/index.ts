const hasTls = (ip: string): boolean => Boolean(ip.match(/\[?\w*(\w)(?!\1)(\w)\2\1/g)?.every(m => m[0] !== '['));

const hasSsl = (ip: string): boolean => {
  const supernets = ip.replace(/\[\w+]/g, ',');
  const abaPattern = /(\w)(?!\1)(?=\w\1)/g;

  let aba;

  while (aba = abaPattern.exec(supernets)) {
    const [a, b] = supernets.substr(aba.index, 2);

    if (ip.match(RegExp(`\\[\\w*${b + a + b}\\w*]`))) {
      return true;
    }
  }

  return false;
};

export const part1 = (ips: string[]): number => ips.reduce((count, ip) => count + +hasTls(ip), 0);
export const part2 = (ips: string[]): number => ips.reduce((count, ip) => count + +hasSsl(ip), 0);

export const parseInput = (input: string): string[] => input.split('\n');
