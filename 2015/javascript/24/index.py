import fileinput
import itertools
import math

def part1(weights):
  return find_optimal_arrangement(weights, 3)

def part2(weights):
  return find_optimal_arrangement(weights, 4)

def find_optimal_arrangement(weights, num_groups):
  weight_per_group = sum(weights) / num_groups
  min_qe = last_group_size = math.inf

  for group in find_groups(weights, weight_per_group):
    if len(group) > last_group_size and min_qe < math.inf:
      return min_qe

    if group_exists(weights - set(group), weight_per_group):
      min_qe = min(math.prod(group), min_qe)

    last_group_size = len(group)

def find_groups(weights, weight_per_group):
  size = 2

  while size <= len(weights):
    for combination in itertools.combinations(weights, size):
      if sum(combination) == weight_per_group:
        yield combination

    size += 1

def group_exists(weights, weight_per_group):
  return next(find_groups(weights, weight_per_group)) != None

weights = set([int(n) for n in fileinput.input()])

print('Part 1:', part1(weights))
print('Part 2:', part2(weights))
