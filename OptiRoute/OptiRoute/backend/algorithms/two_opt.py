def calculate_distance(route, distance_matrix):
    total = 0

    for i in range(len(route) - 1):
        total += distance_matrix[
            route[i]
        ][route[i + 1]]

    return total


def two_opt(route, distance_matrix):

    best_route = route[:]
    best_distance = calculate_distance(
        best_route,
        distance_matrix
    )

    improved = True

    while improved:

        improved = False

        for i in range(1, len(best_route) - 2):

            for j in range(
                i + 1,
                len(best_route) - 1
            ):

                new_route = (
                    best_route[:i]
                    + best_route[i:j + 1][::-1]
                    + best_route[j + 1:]
                )

                new_distance = calculate_distance(
                    new_route,
                    distance_matrix
                )

                if new_distance < best_distance:

                    best_route = new_route
                    best_distance = new_distance

                    improved = True

    return {
        "route": best_route,
        "distance": best_distance
    }