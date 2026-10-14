from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from math import radians, sin, cos, sqrt, atan2

from algorithms.dijkstra import dijkstra
from algorithms.astar import astar
from algorithms.tsp import solve_tsp
from algorithms.two_opt import two_opt


# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI(title="OptiRoute API")


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# REQUEST MODEL
# =====================================================

class LocationRequest(BaseModel):
    locations: list[list[float]]


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "message": "OptiRoute Backend is running"
    }


# =====================================================

# =====================================================

@app.get("/health")
def health():
    return {
        "status": "OK"
    }


# =====================================================
# TEST OPTIMIZATION API
# =====================================================

@app.get("/test-optimize")
def test_optimize():
    return {
        "status": "Optimization API is working"
    }


# =====================================================
# DIJKSTRA
# =====================================================

@app.get("/dijkstra")
def test_dijkstra():

    graph = {
        "A": [
            ("B", 4),
            ("C", 2)
        ],
        "B": [
            ("A", 4),
            ("C", 1),
            ("D", 5)
        ],
        "C": [
            ("A", 2),
            ("B", 1),
            ("D", 8)
        ],
        "D": [
            ("B", 5),
            ("C", 8)
        ]
    }

    result = dijkstra(graph, "A")

    return {
        "algorithm": "Dijkstra",
        "source": "A",
        "shortest_distances": result
    }


# =====================================================
# A STAR
# =====================================================

@app.get("/astar")
def test_astar():

    graph = {
        "A": [
            ("B", 4),
            ("C", 2)
        ],
        "B": [
            ("A", 4),
            ("C", 1),
            ("D", 5)
        ],
        "C": [
            ("A", 2),
            ("B", 1),
            ("D", 8)
        ],
        "D": [
            ("B", 5),
            ("C", 8)
        ]
    }

    coordinates = {
        "A": (0, 0),
        "B": (4, 0),
        "C": (2, 1),
        "D": (5, 3)
    }

    result = astar(
        graph,
        coordinates,
        "A",
        "D"
    )

    return {
        "algorithm": "A*",
        "source": "A",
        "destination": "D",
        "shortest_distance": result
    }


# =====================================================
# HAVERSINE DISTANCE
# =====================================================

def calculate_distance(point1, point2):

    lat1, lon1 = point1
    lat2, lon2 = point2

    R = 6371.0

    lat1 = radians(lat1)
    lat2 = radians(lat2)

    delta_lat = radians(lat2 - lat1)
    delta_lon = radians(lon2 - lon1)

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(delta_lon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    return R * c


# =====================================================
# OPTIMIZE ROUTE
# =====================================================

@app.post("/optimize")
def optimize_route(request: LocationRequest):

    locations = request.locations

    if len(locations) < 2:
        return {
            "error": "At least 2 locations are required"
        }

    if len(locations) > 10:
        return {
            "error": "Maximum 10 locations allowed"
        }

    # Create distance matrix
    distance_matrix = []

    for i in range(len(locations)):

        row = []

        for j in range(len(locations)):

            distance = calculate_distance(
                locations[i],
                locations[j]
            )

            row.append(round(distance, 3))

        distance_matrix.append(row)

    # TSP
    tsp_result = solve_tsp(
        distance_matrix,
        start=0
    )

    # 2-OPT
    optimized_result = two_opt(
        tsp_result["route"],
        distance_matrix
    )

    return {
        "algorithm": "TSP + 2-OPT",
        "locations": locations,
        "distance_matrix": distance_matrix,
        "initial_route": tsp_result["route"],
        "initial_distance": tsp_result["total_distance"],
        "optimized_route": optimized_result["route"],
        "optimized_distance": optimized_result["distance"]
    }


# =====================================================
# DIRECT OPTIMIZATION TEST
# =====================================================

@app.get("/optimize-test")
def optimize_test():

    locations = [
        [26.8467, 80.9462],
        [26.8500, 80.9500],
        [26.8400, 80.9400]
    ]

    # Distance matrix
    distance_matrix = []

    for i in range(len(locations)):

        row = []

        for j in range(len(locations)):

            distance = calculate_distance(
                locations[i],
                locations[j]
            )

            row.append(round(distance, 3))

        distance_matrix.append(row)

    # TSP
    tsp_result = solve_tsp(
        distance_matrix,
        start=0
    )

    # 2-OPT
    optimized_result = two_opt(
        tsp_result["route"],
        distance_matrix
    )

    return {
        "algorithm": "TSP + 2-OPT",
        "initial_route": tsp_result["route"],
        "initial_distance": tsp_result["total_distance"],
        "optimized_route": optimized_result["route"],
        "optimized_distance": optimized_result["distance"],
        "distance_matrix": distance_matrix
    }