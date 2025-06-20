import networkx as nx

def add_super_sink(G, sinks):
    """Add a super sink node to handle multiple sinks"""
    G_ff = G.copy() # Work on a copy so we don’t mess with the original
    G_ff.add_node("SuperSink")
    for sink in sinks:
        # Connect each individual sink to the SuperSink with unlimited capacity
        G_ff.add_edge(sink, "SuperSink", capacity=float('inf'))
    return G_ff

def ford_fulkerson(graph, source, sink):
    """
    Implementation of Ford-Fulkerson algorithm using NetworkX
    
    Args:
        graph (dict): Graph representation
        source (str): Source node ID
        sink (str): Sink node ID or list of sink nodes
        
    Returns:
        tuple: (maximum flow value, flow paths)
    """
    # Convert our graph format to NetworkX DiGraph
    G = nx.DiGraph()
    for u in graph:
        for v in graph[u]:
            G.add_edge(u, v, capacity=graph[u][v]['capacity'])
    
    # If sink is a list, use super sink approach
    if isinstance(sink, list):
        G = add_super_sink(G, sink)
        sink = "SuperSink"
    
    # Run max flow algorithm
    flow_value, flow_dict = nx.maximum_flow(G, source, sink, capacity='capacity')
    
    # Format the output
    flow_paths = []
    for u in flow_dict:
        for v in flow_dict[u]:
            if flow_dict[u][v] > 0:
                # For simplicity, just add the direct edges with flow
                # In a real implementation, you'd want to trace complete paths
                flow_paths.append({
                    "path": [u, v],
                    "flow": flow_dict[u][v]
                })
    
    return flow_value, flow_paths
