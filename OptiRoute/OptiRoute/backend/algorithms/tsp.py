from itertools import permutations


def calculate_distance(route, distance_matrix):
    total_distance = 0

    for i in range(len(route) - 1):
        total_distance += distance_matrix[
            route[i]
        ][route[i + 1]]

    return total_distance


def solve_tsp(distance_matrix, start=0):
    n = len(distance_matrix)

    locations = [
        i for i in range(n)
        if i != start
    ]

    best_route = None
    best_distance = float("inf")

    for permutation in permutations(locations):

        route = [start] + list(permutation) + [start]

        distance = calculate_distance(
            route,
            distance_matrix
        )

        if distance < best_distance:
            best_distance = distance
            best_route = route

    return {
        "route": best_route,
        "total_distance": best_distance
    }