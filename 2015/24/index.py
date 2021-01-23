import fileinput
import itertools
import math

def find_groups(weights, weight_per_group):
  size = 2

  while size <= len(weights):
    for combination in itertools.combinations(weights, size):
      if sum(combination) == weight_per_group:
        yield combination

    size += 1

def group_exists(weights, weight_per_group):
  return next(find_groups(weights, weight_per_group)) != None

def find_min_qe(groups):
  min_qe = math.inf

  for g in groups:
    qe = math.prod(g)
    if qe < min_qe:
      min_qe = qe

  return min_qe

def find_optimal_arrangement(weights, num_groups):
  weight_per_group = sum(weights) / num_groups
  groups_of_size = []
  last_group_size = None

  for group in find_groups(weights, weight_per_group):
    if len(group) != last_group_size:
      if groups_of_size:
        return find_min_qe(groups_of_size)
      groups_of_size = []

    if group_exists(weights - set(group), weight_per_group):
      groups_of_size.append(group)

    last_group_size = len(group)

def part1(weights):
  return find_optimal_arrangement(weights, 3)

def part2(weights):
  return find_optimal_arrangement(weights, 4)

weights = set([int(n) for n in fileinput.input()])

print(part1(weights), part2(weights))
