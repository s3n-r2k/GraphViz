import timeit
from random import choice, randint
from typing import Dict, List, Optional, Tuple


def randomWalk(
    n: int, m: int, k: int, start: Optional[Tuple[int, int]] = None
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
    w = [[x, y]]
    G = {str([x, y]): []}

    while i < k - 1:
        offset = choice([[-1, 0], [1, 0], [0, -1], [0, 1]])
        new_x = x + offset[0]
        new_y = y + offset[1]

        if any([new_x > n, new_x < 0, new_y > m, new_y < 0]):
            continue

        w.append([new_x, new_y])
        node = str([x, y])
        new_node = str([new_x, new_y])
        if G.get(new_node) is None:
            if [new_x, new_y] not in G[node]:
                G[node].append([new_x, new_y])
            G[new_node] = [[x, y]]
            i += 1

        x = new_x
        y = new_y
    return w, G


w, G = randomWalk(5, 5, 10)
print(w)
print(G)
