import networkx as nx

def dijkstra(graph, source):
    """
    Implementation of Dijkstra's algorithm for shortest paths
    
    Args:
        graph (dict): Graph representation
        source (str): Source node ID
        
    Returns:
        tuple: (distances dict, paths dict)
    """
    # Convert our graph format to NetworkX DiGraph
    G = nx.DiGraph()
    for u in graph:
        for v in graph[u]:
            # Use 'weight', 'distance' or 'cost' as the edge weight
            weight = graph[u][v].get('weight', 
                     graph[u][v].get('distance',
                     graph[u][v].get('cost', 1)))
            # Add the edge along with the resolved weight
            G.add_edge(u, v, weight=weight)
    
    # Calculate shortest paths 
    paths = nx.single_source_dijkstra_path(G, source, weight='weight')

    # Get shortest distances from source to all reachable nodes
    distances = nx.single_source_dijkstra_path_length(G, source, weight='weight')

    # Returning both distances and full paths
    return distances, paths
