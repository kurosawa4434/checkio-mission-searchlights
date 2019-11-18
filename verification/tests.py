"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

from math import sqrt, sin, cos, pi, ceil
from itertools import chain
from random import randint


def get_vertices(x, y, edge_length, v):
    deg_d = 360 / v
    deg_total = 180 + (90 - ((180 * (v - 2) / v) / 2))
    for i in range(v):
        rad = pi * 2 * (deg_total / 360)
        x += cos(rad) * edge_length
        y += sin(rad) * edge_length
        deg_total += deg_d
        if x < 0 or y < 0:
            continue

        yield x, y


def searchlights(polygons, lights):
    result = 0
    for x, y, edge_length, vertices in polygons:
        for vx, vy in get_vertices(x, y, edge_length, vertices):
            for cx, cy, cr in lights:
                if cr >= sqrt((vx - cx) ** 2 + (vy - cy) ** 2):
                    result += 1
                    break

    return result


def make_random_tests(num):
    random_tests = []

    for _ in range(num):
        lights = []
        for _ in range(randint(1, 8)):
            lights.append((randint(0, 8), randint(1, 8), (randint(1, 2))))

        polygons = set()
        all_coords = []
        while len(polygons) < 2:
            polygon = randint(0, 8), randint(0, 8), randint(1, 2), randint(3, 8)
            vertices = list(get_vertices(*polygon))
            for vx, vy in vertices:
                if -0.1 <= vx <= 0.1 or -0.1 <= vy <= 0.1:
                    break
                if any(abs(cr - sqrt((vx - cx)**2 + (vy - cy)**2)) <= 0.1 for cx, cy, cr in lights):
                    break
            else:
                polygons.add(polygon)
                all_coords += chain(*vertices)

        random_tests.append({'input': [list(map(list, polygons)), list(map(list, lights))],
                             'answer': searchlights(polygons, lights),
                             'explanation': max(8, ceil(max(all_coords)))
                             })

    return random_tests


TESTS = {
    "Basics": [
        {
            'input': [[[2, 3, 2, 3]], [[1, 2, 1]]],
            'answer': 1,
            'explanation': 4,
        },
        {
            'input': [[[4, 5, 2, 4]], [[4, 4, 3]]],
            'answer': 4,
            'explanation': 6,
        },
        {
            'input': [[[6, 7, 2, 5]], [[2, 3, 2]]],
            'answer': 0,
            'explanation': 8,
        },
        {
            'input': [[[4, 2, 2, 6]], [[4, 1, 3]]],
            'answer': 3,
            'explanation': 8,
        },
        {
            'input': [[[1, 7, 2, 8]], [[0, 5, 4]]],
            'answer': 5,
            'explanation': 10,
        },
        {
            'input': [[[4, 7, 3, 6]], [[4, 4, 1]]],
            'answer': 0,
            'explanation': 8,
        },
        {
            'input': [[[2, 3, 2, 6], [4, 7, 2, 6]],
                      [[3, 3, 2]]
                      ],
            'answer': 4,
            'explanation': 8,
        },
        {
            'input': [[[4, 4, 2, 4]],
                      [[2, 3, 1], [4, 4, 1]]
                      ],
            'answer': 2,
            'explanation': 6,
        },
        {
            'input': [[[2, 5, 3, 3], [6, 5, 3, 3]],
                      [[3, 4, 2], [4, 2, 2]]
                      ],
            'answer': 3,
            'explanation': 8,
        },
        {
            'input': [[[1, 5, 2, 4], [7, 5, 2, 4], [4, 6, 2, 4]],
                      [[2, 4, 1], [3, 4, 1], [4, 4, 1], [5, 4, 1], [6, 4, 1]],
                      ],
            'answer': 5,
            'explanation': 8,
        },
    ],
    "Randoms": make_random_tests(5)
}
