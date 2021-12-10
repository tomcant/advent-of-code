import { createHash } from "crypto";

const PASS_LENGTH = 8;

export const parseInput = (input: string): string => input;

export const part1 = (doorId: string): string => {
  let password = "";

  for (const hash of generatePasswordCharacterHashes(doorId)) {
    password += hash[5];

    if (password.length === PASS_LENGTH) {
      return password;
    }
  }
};

export const part2 = (doorId: string): string => {
  let password = Array(PASS_LENGTH);

  for (const hash of generatePasswordCharacterHashes(doorId)) {
    if (hash[5] < password.length && !password[hash[5]]) {
      password[hash[5]] = hash[6];

      if (password.filter(Boolean).length === PASS_LENGTH) {
        return password.join("");
      }
    }
  }
};

const generatePasswordCharacterHashes = function* (doorId: string) {
  const prefix = "0".repeat(5);
  let hash;
  let n = 0;

  while (true) {
    do {
      hash = createHash("md5")
        .update(doorId + n)
        .digest("hex");
    } while (++n && hash.substr(0, prefix.length) !== prefix);

    yield hash;
  }
};
