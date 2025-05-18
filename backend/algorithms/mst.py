import networkx as nx

def convert_to_undirected(graph):
    """Convert directed graph to undirected for MST algorithms"""
    G_undirected = nx.Graph()
    
    for u in graph:
        for v in graph[u]:
            if G_undirected.has_edge(u, v):
                continue
            G_undirected.add_edge(u, v, weight=graph[u][v].get('cost', 1))
    
    return G_undirected

def kruskals_algorithm(graph):
    """
    Implementation of Kruskal's algorithm for Minimum Spanning Tree
    
    Args:
        graph (dict): Graph representation
        
    Returns:
        tuple: (list of MST edges, total cost)
    """
    # Convert to undirected graph
    G_undirected = convert_to_undirected(graph)
    
    # Apply Kruskal's algorithm
    mst = nx.minimum_spanning_tree(G_undirected, weight="weight", algorithm="kruskal")
    
    # Calculate total cost
    total_cost = sum(mst[u][v]['weight'] for u, v in mst.edges())
    
    # Return edges and total cost
    mst_edges = list(mst.edges())
    
    return mst_edges, total_cost

def prims_algorithm(graph):
    """
    Implementation of Prim's algorithm for Minimum Spanning Tree
    
    Args:
        graph (dict): Graph representation
        
    Returns:
        tuple: (list of MST edges, total cost)
    """
    # Convert to undirected graph
    G_undirected = convert_to_undirected(graph)
    
    # Apply Prim's algorithm
    mst = nx.minimum_spanning_tree(G_undirected, weight="weight", algorithm="prim")
    
    # Calculate total cost
    total_cost = sum(mst[u][v]['weight'] for u, v in mst.edges())
    
    # Return edges and total cost
    mst_edges = list(mst.edges())
    
    return mst_edges, total_cost
