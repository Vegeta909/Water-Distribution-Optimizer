def parse_graph_data(data, flow=False):
    """
    Parse the JSON graph data into a format suitable for the algorithms
    
    Args:
        data (dict): JSON data containing nodes and edges
        flow (bool): Whether to parse for flow algorithms (needs source/sink)
        
    Returns:
        dict or tuple: Graph representation (and source/sink nodes if flow=True)
    """
    if 'nodes' not in data or 'edges' not in data:
        raise ValueError("Input data must contain 'nodes' and 'edges'")
    
    graph = {}
    
    # Initialize nodes
    for node in data['nodes']:
        node_id = node['id']
        graph[node_id] = {}
    
    # Add edges with weights
    for edge in data['edges']:
        source = edge['source']
        target = edge['target']
        
        # Ensure source and target exist
        if source not in graph or target not in graph:
            raise ValueError(f"Edge {source}->{target} references undefined node")
        
        # Extract weights based on edge properties
        weight = edge.get('weight', 1)
        capacity = edge.get('capacity', weight)
        cost = edge.get('cost', weight)
        
        # Store edge information
        graph[source][target] = {
            'capacity': capacity,
            'cost': cost,
            'weight': weight
        }
        
        # For undirected graphs (if specified)
        if not edge.get('directed', False):
            if target not in graph:
                graph[target] = {}
            graph[target][source] = {
                'capacity': capacity,
                'cost': cost,
                'weight': weight
            }
    
    if flow:
        source_node = data.get('source')
        sink_node = data.get('sink')
        
        if not source_node or not sink_node:
            raise ValueError("Flow analysis requires source and sink nodes")
            
        return graph, source_node, sink_node
    
    return graph
