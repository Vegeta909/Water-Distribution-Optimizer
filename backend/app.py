from flask import Flask, request, jsonify
from flask_cors import CORS
from algorithms.ford_fulkerson import ford_fulkerson
from algorithms.mst import prims_algorithm, kruskals_algorithm
from algorithms.dijkstra import dijkstra
from utils.graph_parser import parse_graph_data
from utils.network_creator import create_water_network

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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

if __name__ == '__main__':
    app.run(debug=True)
