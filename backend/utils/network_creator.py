import networkx as nx
import random

def create_water_network(num_reservoirs=2, num_junctions=5, num_consumers=3):
    """
    Create a realistic water distribution network
    
    Args:
        num_reservoirs: Number of water reservoirs (sources)
        num_junctions: Number of pipe junctions
        num_consumers: Number of end consumers (sinks)
    
    Returns:
        dict: Network data in the format needed by the frontend
    """
    G = nx.DiGraph()
    
    # Create nodes
    reservoirs = [f"reservoir_{i}" for i in range(1, num_reservoirs+1)]
    junctions = [f"junction_{i}" for i in range(1, num_junctions+1)]
    consumers = [f"consumer_{i}" for i in range(1, num_consumers+1)]
    
    # Add nodes with types
    for node in reservoirs:
        G.add_node(node, type="source", capacity=random.randint(800, 1200))
    
    for node in junctions:
        G.add_node(node, type="junction")
    
    for node in consumers:
        G.add_node(node, type="sink", demand=random.randint(100, 300))
    
    # Connect reservoirs to junctions
    for reservoir in reservoirs:
        # Connect each reservoir to 1-3 random junctions
        for _ in range(random.randint(1, min(3, len(junctions)))):
            junction = random.choice(junctions)
            capacity = random.randint(300, 600)
            cost = random.randint(5, 15)
            G.add_edge(reservoir, junction, capacity=capacity, cost=cost, distance=cost)
    
    # Connect junctions to other junctions
    for i, junction1 in enumerate(junctions):
        for junction2 in junctions[i+1:]:
            # 40% chance of connecting junctions
            if random.random() < 0.4:
                capacity = random.randint(200, 400)
                cost = random.randint(2, 8)
                G.add_edge(junction1, junction2, capacity=capacity, cost=cost, distance=cost)
                # 50% chance of making it bidirectional
                if random.random() < 0.5:
                    G.add_edge(junction2, junction1, capacity=capacity, cost=cost, distance=cost)
    
    # Connect junctions to consumers
    for consumer in consumers:
        # Connect each consumer to 1-2 random junctions
        for _ in range(random.randint(1, min(2, len(junctions)))):
            junction = random.choice(junctions)
            capacity = random.randint(100, 300)
            cost = random.randint(3, 10)
            G.add_edge(junction, consumer, capacity=capacity, cost=cost, distance=cost)
    
    # Convert to the format needed by the frontend
    nodes = []
    for node in G.nodes():
        node_data = {"id": node}
        if "type" in G.nodes[node]:
            node_data["type"] = G.nodes[node]["type"]
        nodes.append(node_data)
    
    edges = []
    for u, v in G.edges():
        edge_data = {
            "source": u,
            "target": v,
            "capacity": G.edges[u, v].get("capacity", 0),
            "cost": G.edges[u, v].get("cost", 0),
            "distance": G.edges[u, v].get("distance", 0)
        }
        edges.append(edge_data)
    
    return {
        "nodes": nodes,
        "edges": edges,
        "source": reservoirs[0],
        "sink": consumers[0]
    }
