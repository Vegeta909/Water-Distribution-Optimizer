def get_sample_data():
    """Return a sample water distribution network data"""
    return {
        "nodes": [
            {"id": "Reservoir_A", "type": "reservoir", "capacity": 1000},
            {"id": "Pump_A", "type": "pump", "pressure": 100},
            {"id": "Junction_A", "type": "junction"},
            {"id": "Junction_B", "type": "junction"},
            {"id": "Reservoir_B", "type": "reservoir", "capacity": 800},
            {"id": "Junction_C", "type": "junction"},
            {"id": "Reservoir_C", "type": "reservoir", "capacity": 700},
            {"id": "Pump_B", "type": "pump", "pressure": 100},
            {"id": "Junction_D", "type": "junction"},
            {"id": "Reservoir_D", "type": "reservoir", "capacity": 700}
        ],
        "edges": [
            {"source": "Reservoir_A", "target": "Pump_A", "capacity": 800, "cost": 600, "pressure_loss": 0.5},
            {"source": "Pump_A", "target": "Junction_A", "capacity": 600, "cost": 400, "pressure_loss": 0.4},
            {"source": "Junction_A", "target": "Junction_B", "capacity": 500, "cost": 300, "pressure_loss": 0.3},
            {"source": "Junction_B", "target": "Reservoir_B", "capacity": 400, "cost": 350, "pressure_loss": 0.4},
            {"source": "Junction_A", "target": "Junction_C", "capacity": 500, "cost": 300, "pressure_loss": 0.3},
            {"source": "Junction_C", "target": "Reservoir_C", "capacity": 400, "cost": 350, "pressure_loss": 0.4},
            {"source": "Reservoir_A", "target": "Pump_B", "capacity": 800, "cost": 600, "pressure_loss": 0.5},
            {"source": "Pump_B", "target": "Junction_D", "capacity": 600, "cost": 400, "pressure_loss": 0.4},
            {"source": "Junction_D", "target": "Reservoir_D", "capacity": 400, "cost": 350, "pressure_loss": 0.4}
        ],
        "source": "Reservoir_A",
        "sink": ["Reservoir_B", "Reservoir_C", "Reservoir_D"]
    }

def get_small_town_network():
    """Water distribution network for a small town"""
    return {
        "nodes": [
            {"id": "main_reservoir", "type": "source"},
            {"id": "treatment_plant", "type": "junction"},
            {"id": "downtown_junction", "type": "junction"},
            {"id": "residential_junction", "type": "junction"},
            {"id": "industrial_junction", "type": "junction"},
            {"id": "downtown_area", "type": "sink"},
            {"id": "residential_area", "type": "sink"},
            {"id": "industrial_area", "type": "sink"}
        ],
        "edges": [
            {"source": "main_reservoir", "target": "treatment_plant", "capacity": 1000, "cost": 10, "distance": 8},
            {"source": "treatment_plant", "target": "downtown_junction", "capacity": 600, "cost": 7, "distance": 5},
            {"source": "treatment_plant", "target": "residential_junction", "capacity": 400, "cost": 8, "distance": 6},
            {"source": "downtown_junction", "target": "industrial_junction", "capacity": 300, "cost": 4, "distance": 4},
            {"source": "downtown_junction", "target": "downtown_area", "capacity": 400, "cost": 5, "distance": 3},
            {"source": "residential_junction", "target": "residential_area", "capacity": 350, "cost": 6, "distance": 4},
            {"source": "industrial_junction", "target": "industrial_area", "capacity": 250, "cost": 7, "distance": 5}
        ],
        "source": "main_reservoir",
        "sink": "downtown_area"
    }

def get_large_distribution_network():
    """Complex water distribution network for a larger area"""
    # Extract this from your teammate's notebook
    # This is just a placeholder example
    return {
        "nodes": [...],  # Many more nodes from the notebook
        "edges": [...],  # Many more edges from the notebook
        "source": "main_reservoir",
        "sink": "area_12"
    }

