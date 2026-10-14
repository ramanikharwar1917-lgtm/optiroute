from algorithms.tsp import solve_tsp
from algorithms.two_opt import two_opt


distance_matrix = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
]


print("Testing TSP...")

tsp_result = solve_tsp(
    distance_matrix,
    start=0
)

print("TSP result:")
print(tsp_result)


print("Testing 2-OPT...")

result = two_opt(
    tsp_result["route"],
    distance_matrix
)

print("2-OPT result:")
print(result)