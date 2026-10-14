import heapq
import math


def heuristic(a, b):
    return math.sqrt(
        (a[0] - b[0]) ** 2 +
        (a[1] - b[1]) ** 2
    )


def astar(graph, coordinates, start, goal):

    open_set = [(0, start)]

    g_score = {
        node: float("inf")
        for node in graph
    }

    g_score[start] = 0

    while open_set:

        _, current = heapq.heappop(open_set)

        if current == goal:
            return g_score[current]

        for neighbor, weight in graph[current]:

            tentative_g = g_score[current] + weight

            if tentative_g < g_score[neighbor]:

                g_score[neighbor] = tentative_g

                f_score = (
                    tentative_g
                    + heuristic(
                        coordinates[neighbor],
                        coordinates[goal]
                    )
                )

                heapq.heappush(
                    open_set,
                    (f_score, neighbor)
                )

    return float("inf")