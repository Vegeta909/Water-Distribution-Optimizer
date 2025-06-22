from flask import Flask, request, jsonify
from flask_cors import CORS
from algorithms.ford_fulkerson import ford_fulkerson
from algorithms.mst import prims_algorithm, kruskals_algorithm
from algorithms.dijkstra import dijkstra
from utils.graph_parser import parse_graph_data
from utils.network_creator import create_water_network
import pandas as pd
import os
import math

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ---------- Root Route ----------
@app.route('/')
def home():
    return 'Water Distribution Optimizer Backend is running!'

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/generate-network', methods=['POST'])
def generate_network():
    data = request.json
    print("Received request with data:", data)  # Debug print
    
    num_reservoirs = data.get('reservoirs', 2)
    num_junctions = data.get('junctions', 5)
    num_consumers = data.get('consumers', 3)
    
    try:
        network = create_water_network(
            num_reservoirs=num_reservoirs,
            num_junctions=num_junctions,
            num_consumers=num_consumers
        )
        print("Generated network:", network)  # Debug print
        return jsonify(network)
    except Exception as e:
        print("Error generating network:", str(e))  # Debug print
        return jsonify({"error": str(e)}), 400


@app.route('/api/max-flow', methods=['POST'])
def calculate_max_flow():
    data = request.json
    try:
        graph, source, sink = parse_graph_data(data, flow=True)
        max_flow_value, flow_paths = ford_fulkerson(graph, source, sink)
        return jsonify({
            "maxFlow": max_flow_value,
            "flowPaths": flow_paths
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/mst', methods=['POST'])
def calculate_mst():
    data = request.json
    try:
        graph = parse_graph_data(data)
        
        # Default to Prim's algorithm, but allow selection
        algorithm = request.args.get('algorithm', 'prims')
        
        if algorithm == 'kruskals':
            mst_edges, total_cost = kruskals_algorithm(graph)
        else:  # Default to Prim's
            mst_edges, total_cost = prims_algorithm(graph)
            
        return jsonify({
            "mstEdges": mst_edges,
            "totalCost": total_cost
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/shortest-path', methods=['POST'])
def calculate_shortest_path():
    data = request.json
    try:
        graph = parse_graph_data(data)
        source = data.get('source')
        target = data.get('target')
        
        if not source or not target:
            return jsonify({"error": "Source and target nodes are required"}), 400
            
        distances, paths = dijkstra(graph, source)
        
        if target not in distances:
            return jsonify({"error": f"No path exists to target node {target}"}), 404
            
        return jsonify({
            "distance": distances[target],
            "path": paths[target]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ---------- Sensor Data Endpoint ----------
@app.route('/api/sensor-data', methods=['GET'])
def get_sensor_data():
    csv_path = os.path.join(os.path.dirname(__file__), 'data/Filtered_Data.csv')
    df = pd.read_csv(csv_path)
    # Only return relevant columns
    columns = ['created_at', 'Pressure 1', 'Pressure 2', 'Flow rate']
    filtered = df[columns]
    return filtered.to_json(orient='records')

# ---------- Dynamic Routing Endpoint ----------
def dynamic_dijkstra(graph, start):
    import heapq
    queue = [(0, start)]
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    previous = {node: None for node in graph}
    while queue:
        (dist, current_node) = heapq.heappop(queue)
        for neighbor, weight in graph[current_node].items():
            new_distance = dist + weight
            if new_distance < distances[neighbor]:
                distances[neighbor] = new_distance
                previous[neighbor] = current_node
                heapq.heappush(queue, (new_distance, neighbor))
    return distances, previous

def compute_dynamic_weights(base_graph, flow, pressure1, pressure2):
    dynamic_graph = {}
    factor = (abs(pressure1 - pressure2) + 1) / (flow + 1)
    for node in base_graph:
        dynamic_graph[node] = {}
        for neighbor, base_weight in base_graph[node].items():
            dynamic_graph[node][neighbor] = base_weight * factor
    return dynamic_graph

@app.route('/api/dynamic-routing', methods=['GET'])
def dynamic_routing():
    # Example base graph (could be made dynamic if needed)
    base_graph = {
        'A': {'B': 4, 'C': 2},
        'B': {'A': 4, 'C': 1, 'D': 5},
        'C': {'A': 2, 'B': 1, 'D': 8},
        'D': {'B': 5, 'C': 8}
    }
    
    try:
        csv_path = os.path.join(os.path.dirname(__file__), 'data/Filtered_Data.csv')
        df = pd.read_csv(csv_path)
        # Use the 10th row as in the notebook
        sample = df.iloc[10]
        flow = sample['Flow rate']
        p1 = sample['Pressure 1']
        p2 = sample['Pressure 2']
        
        # Create dynamic graph with weights
        dynamic_graph = compute_dynamic_weights(base_graph, flow, p1, p2)
        distances, _ = dynamic_dijkstra(dynamic_graph, 'A')
        
        # Convert to network structure for visualization
        nodes = []
        edges = []
        
        # Add nodes with positions based on a circular layout
        num_nodes = len(dynamic_graph)
        for i, node_id in enumerate(dynamic_graph.keys()):
            angle = (2 * math.pi * i) / num_nodes
            x = 50 + 40 * math.cos(angle)  # Center at 50,50 with radius 40
            y = 50 + 40 * math.sin(angle)
            node_type = 'source' if node_id == 'A' else 'sink' if node_id == 'D' else 'junction'
            nodes.append({
                'id': node_id,
                'type': node_type,
                'x': x,
                'y': y,
                'distance': round(distances.get(node_id, float('inf')), 2)
            })
        
        # Add edges with weights (rounded)
        for source, targets in dynamic_graph.items():
            for target, weight in targets.items():
                edges.append({
                    'source': source,
                    'target': target,
                    'distance': round(weight, 2),
                    'value': f"{weight:.2f}"
                })
        
        return jsonify({
            'network': {
                'nodes': nodes,
                'edges': edges,
                'source': 'A',
                'sink': 'D'
            },
            'routing_table': {k: round(v, 2) for k, v in distances.items()}
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
