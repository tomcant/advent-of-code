from collections import defaultdict
from re import findall


def parse_input(input):
    return tuple(map(int, findall(r'\d+', input)))


def part1(input):
    players, marbles = input
    return find_high_score(players, marbles)


def part2(input):
    players, marbles = input
    return find_high_score(players, marbles * 100)


def find_high_score(players, marbles):
    game = MarbleMania(players)
    scores = defaultdict(int)

    for marble in range(marbles):
        player, score = game.take_turn(marble + 1)
        scores[player] += score

    return sorted(scores.values())[-1]


class Marble:
    def __init__(self, value):
        self.value = value
        self.next = self.prev = self


class MarbleMania:
    def __init__(self, players):
        self.players = players
        self.current = Marble(0)
        self.to_remove = None

    def take_turn(self, marble):
        if marble % 23 == 0:
            score = marble + self.to_remove.value
            self._remove()
        else:
            score = 0
            self._insert(marble)

        return marble % self.players, score

    def _insert(self, value):
        marble_a = self.current.next
        marble_b = marble_a.next

        marble = Marble(value)
        marble.next = marble_b
        marble.prev = marble_a

        marble_a.next = marble
        marble_b.prev = marble

        self.current = marble
        self.to_remove = marble.prev.prev.prev.prev.prev.prev.prev

    def _remove(self):
        marble_a = self.to_remove.prev
        marble_b = self.to_remove.next

        marble_a.next = marble_b
        marble_b.prev = marble_a

        self.current = marble_b
