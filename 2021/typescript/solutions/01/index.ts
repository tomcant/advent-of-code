export const parseInput = (input: string): number[] =>
  input.split("\n").map(Number);

export const part1 = (nums: number[]): number => {
  let count = 0;

  for (let i = 1; i < nums.length; ++i) {
    if (nums[i] > nums[i - 1]) {
      count += 1;
    }
  }

  return count;
};

export const part2 = (nums: number[]): number => {
  let count = 0;

  for (let i = 3; i < nums.length; ++i) {
    if (nums[i - 3] < nums[i]) {
      count += 1;
    }
  }

  return count;
};
