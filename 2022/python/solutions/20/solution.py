def parse_input(input):
    return map(int, input.splitlines())


def part1(encrypted_file):
    return get_grove_coordinate(mix_file(encrypted_file))


def part2(encrypted_file):
    encrypted_file = map(lambda n: n * 811589153, encrypted_file)
    return get_grove_coordinate(mix_file(encrypted_file, times=10))


def get_grove_coordinate(file):
    return sum(file[(file.index(0) + idx) % len(file)] for idx in [1000, 2000, 3000])


def mix_file(file, times=1):
    ll = LinkedList(file)
    order = ll.nodes()

    for _ in range(times):
        for node in order:
            node.prev.next = node.next
            node.next.prev = node.prev

            new_next = node.next
            for _ in range(node.value % (ll.length - 1)):
                new_next = new_next.next

            node.next = new_next
            node.prev = new_next.prev
            new_next.prev.next = node
            new_next.prev = node

    return ll.values()


class LinkedList:
    def __init__(self, values):
        self.head = None
        self.length = 0

        for value in values:
            self._insert(value)

    def values(self):
        return [node.value for node in self.nodes()]

    def nodes(self):
        nodes = []
        node = self.head

        for _ in range(self.length):
            nodes.append(node)
            node = node.next

        return nodes

    def _insert(self, value):
        self.length += 1
        node = Node(value)

        if self.head is None:
            self.head = node
            return

        node.next = self.head
        node.prev = self.head.prev
        self.head.prev.next = node
        self.head.prev = node


class Node:
    def __init__(self, value):
        self.value = value
        self.next = self.prev = self
