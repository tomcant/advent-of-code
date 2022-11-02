from datetime import datetime
import importlib.util
import os
import sys


def main(day_no):
    day_dir = '{}/solutions/{:02}'.format(os.path.dirname(__file__), day_no)
    solution = load_solution(day_dir + '/solution.py')
    input_path = day_dir + '/input.txt'

    for part in ['part1', 'part2']:
        if not hasattr(solution, part):
            continue

        input = open(input_path).read()
        if hasattr(solution, 'parse_input'):
            input = solution.parse_input(input)

        start_time = datetime.now()
        answer = getattr(solution, part)(input)
        duration = (datetime.now() - start_time).total_seconds() * 1000

        print('Part {}: {} [{:.3f} ms]'.format(part[-1], answer, duration))


def load_solution(path):
    spec = importlib.util.spec_from_file_location('solution', path)
    solution = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(solution)
    return solution


if __name__ == '__main__':
    main(int(sys.argv[1]))
