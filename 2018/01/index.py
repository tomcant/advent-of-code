import fileinput

part1 = sum

def part2(diffs):
  current, seen = 0, {0}

  while True:
    for diff in diffs:
      current += diff
      if current in seen:
        return current
      seen.add(current)

diffs = [int(n) for n in fileinput.input()]

print(part1(diffs), part2(diffs))
