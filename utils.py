from collections import deque
from math import inf
from queue import PriorityQueue
from random import choice, randint
from sys import displayhook
from typing import Dict, List, Optional, Tuple, no_type_check_decorator


class Node:
    def __init__(self, name: str, neighbours: List[Tuple[str, float]]) -> None:
        self.name = name
        self.neighbours = neighbours
        self.parent = None
        self.visited = None
        self.distance = inf


def build(nodes: List[Node]):
    G = {n.name: n for n in nodes}
    return G


def randomWalk(
    n: int,
    m: int,
    k: int,
    start: Optional[Tuple[int, int]] = None,
    edge_len: bool = False,
) -> List[List[int]]:
    """Random Walk.

    Generates a random walk of k nodes on an n x m grid.

    Parameters
    ----------
    n : int
        [description]
    m : int
        [description]
    k : int
        [description]
    start : Optional[Tuple[int, int]], optional
        [description], by default None

    Returns
    -------
    List[List[int, int]]
        [description]
    """
    if k > m * n:
        raise ValueError(f"k must be strictly less then n * m")

    if start is None:
        x = randint(0, n)
        y = randint(0, m)
    else:
        if any([start[0] > n, start[0] < 0, start[1] > m, start[1] < 0]):
            raise ValueError("Invalid starting point")
        x = start[0]
        y = start[1]

    i = 0
    node = str([x, y])
    w = [node]
    G = {node: []}

    while i < k - 1:
        offset = choice([[-1, 0], [1, 0], [0, -1], [0, 1]])
        new_x = x + offset[0]
        new_y = y + offset[1]

        if any([new_x > n, new_x < 0, new_y > m, new_y < 0]):
            continue

        node = str([x, y])
        new_node = str([new_x, new_y])

        if new_node not in w:
            edge = randint(1, 10) if edge_len else 1
            if not set([(new_node, edge)]).issubset(G[node]):
                G[node].append((new_node, edge))
            G[new_node] = [(node, edge)]
            i += 1

        w.append(new_node)
        x = new_x
        y = new_y
    return w, G


def BFS(G, s: Node, e: Node):
    q = deque()
    q.append(s)

    Graph = {
        k: {"edges": v, "visited": False, "parent": None} for k, v in G.items()
    }

    Graph[s]["visited"] = True

    while len(q) > 0:
        node = q.popleft()
        if node == e:
            break
        neighbours = Graph[node]["edges"]
        for neighbour, _ in neighbours:
            if not Graph[neighbour]["visited"]:
                q.append(neighbour)
                Graph[neighbour]["visited"] = True
                Graph[neighbour]["parent"] = node

    # Backtrace path
    path = []
    current_node = e
    while Graph[current_node]["parent"] is not None:
        path.append(current_node)
        current_node = Graph[current_node]["parent"]
    path.append(s)
    path.reverse()
    return path


def dijkstra(G, s, e=None):
    Graph = {
        k: {"edges": v, "visited": False, "parent": None, "distance": inf}
        for k, v in G.items()
    }
    # Vertex priority queue Q
    Q = PriorityQueue()

    dist = {k: inf for k, _ in G.items()}
    prev = {k: None for k, _ in G.items()}
    dist[s] = 0
    for vertex in dist.items():
        Q.put(vertex)

    while not Q.empty():
        current, _ = Q.get()
        for neighbor, length in Graph[current]["edges"]:
            alt = dist[current] + length
            if alt < dist[neighbor]:
                dist[neighbor] = alt
                prev[neighbor] = current
                Q.put((neighbor, alt))

    if not prev[e]:
        return None
    else:
        current = e
        path = []
        while current != s or prev[current] is not None:
            path.append(current)
            current = prev[current]
        path.append(s)
        path.reverse()

    return path


w, G = randomWalk(5, 5, 10, edge_len=True)
print(G)
# print(BFS(G, w[0], w[-1]))
print(dijkstra(G, w[0], w[-1]))
