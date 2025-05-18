# Water Distribution Optimizer

A smart city application that optimizes water distribution networks using graph algorithms. This tool visualizes water networks and performs maximum flow analysis, cost-effective pipeline design, and efficient water routing.

## ✨ Features

- **Maximum Flow Analysis**: Optimize water flow from source to destination using the Ford-Fulkerson algorithm
- **Cost-Effective Pipeline Design**: Generate minimum spanning trees using Prim's/Kruskal's algorithm
- **Efficient Water Routing**: Find shortest paths using Dijkstra's algorithm
- **Interactive Visualization**: Dynamic graph visualization with node type differentiation
- **Network Generator**: Create sample water distribution networks

## 🏗️ Project Structure

```
water-distribution-optimizer/
├── backend/                  # Flask backend
│   ├── algorithms/           # Graph algorithm implementations
│   │   ├── ford_fulkerson.py # Maximum flow algorithm
│   │   ├── mst.py            # Minimum spanning tree algorithms
│   │   └── dijkstra.py       # Shortest path algorithm
│   ├── utils/                # Utility functions
│   │   ├── graph_parser.py   # Parsing graph data
│   │   └── network_creator.py # Creating sample networks
│   └── app.py                # Flask application entry point
└── frontend/                 # React frontend
    ├── public/               # Static files
    └── src/                  # Source code
        ├── components/       # React components
        ├── pages/            # Application pages
        └── App.js            # Main application component
```

## 📥 Installation

### Prerequisites
- Python 3.8+ for the backend
- Node.js and npm for the frontend
- Git (optional, for cloning the repository)

### Clone the Repository
```bash
git clone https://github.com/Vegeta909/Water-Distribution-Optimizer.git
cd water-distribution-optimizer
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python -m venv venv
source venv/bin/activate

# Install required packages
pip install flask flask-cors networkx matplotlib numpy

# Return to project root
cd ..
```

### Frontend Setup 
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Return to project root
cd ..
```

## 🚀 Running the Application

### Start the Backend Server
```bash
# Navigate to backend directory
cd backend

# Activate the virtual environment if not already activated
# For Windows
venv\Scripts\activate
# For macOS/Linux
source venv/bin/activate

# Run the Flask server
python app.py
```

The backend server will start running at http://localhost:5000.

### Start the Frontend Development Server
Open a new terminal window/tab and run:

```bash
# Navigate to frontend directory
cd frontend

# Start the development server
npm start
```

The frontend application will open in your browser at http://localhost:3000.

## 📖 Usage Guide

### Home Page
The home page provides an overview of the three main features:
1. Optimize Water Flow
2. Design Pipelines 
3. Route Water

Click on any of these options to navigate to the respective tools.

### Optimize Water Flow (Maximum Flow)
1. Enter node names separated by commas (e.g., `reservoir1, junction1, consumer1`)
2. Define connections between nodes with their capacities
3. Select source and sink nodes
4. Click "Analyze Network" to calculate the maximum flow
5. View the results and visualization

### Design Pipelines (Minimum Spanning Tree)
1. Enter node names separated by commas
2. Define connections between nodes with their costs
3. Click "Analyze Network" to generate the minimum spanning tree
4. View the cost-optimized network design

### Route Water (Shortest Path)
1. Enter node names separated by commas
2. Define connections between nodes with their distances
3. Select source and target nodes
4. Click "Analyze Network" to find the shortest path
5. View the optimal route

### Network Generation
For each tool, you can:
- Click "Generate" to create a random water distribution network
- Click "Load Example" to load a pre-defined example network

## 🧮 Algorithms

- **Maximum Flow**: Implements the Ford-Fulkerson algorithm to find the maximum amount of water that can flow through the network.
- **Minimum Spanning Tree**: Uses Prim's or Kruskal's algorithm to find the most cost-effective way to connect all nodes.
- **Shortest Path**: Applies Dijkstra's algorithm to find the shortest route between two points.

## 💻 Technologies Used

- **Backend**: Flask, NetworkX, Matplotlib, NumPy
- **Frontend**: React, Material-UI, D3.js
- **Algorithms**: Ford-Fulkerson, Prim's/Kruskal's, Dijkstra's
