# 💧 Water Distribution Optimizer

A smart city application for optimizing and monitoring water distribution networks using advanced graph algorithms and real sensor data. The tool provides interactive visualizations, real-time monitoring, and classic network optimization algorithms.

## ✨ Features

- **Sensor Data Analysis**: Visualize and analyze real sensor data (pressure, flow) with an interactive time slider and network state visualization.
- **Dynamic Network Monitoring**: Monitor dynamic routing and network state based on live or historical sensor data, with D3-based network visualization and routing summaries.
- **Maximum Flow Analysis**: Optimize water flow from source to destination using the Ford-Fulkerson algorithm.
- **Cost-Effective Pipeline Design**: Generate minimum spanning trees using Prim's/Kruskal's algorithm.
- **Efficient Water Routing**: Find shortest paths using Dijkstra's algorithm.
- **Interactive Visualization**: Dynamic graph visualization with node type differentiation, edge highlighting, and real-time updates.
- **Network Generator**: Create sample water distribution networks for experimentation.

## 🏗️ Project Structure

```
Water-Distribution-Optimizer/
├── backend/                  # Flask backend
│   ├── algorithms/           # Graph algorithm implementations
│   │   ├── ford_fulkerson.py # Maximum flow algorithm
│   │   ├── mst.py            # Minimum spanning tree algorithms
│   │   ├── dijkstra.py       # Shortest path algorithm
│   ├── utils/                # Utility functions (graph parsing, network creation)
│   ├── data/                 # Filtered sensor data (CSV)
│   ├── venv/                 # Python virtual environment
│   └── app.py                # Flask application entry point
├── frontend/                 # React frontend
│   ├── public/               # Static files (index.html, manifest, favicon)
│   ├── src/                  # Source code
│   │   ├── components/       # React components (GraphVisualizer, Navbar, Footer, etc.)
│   │   ├── pages/            # Application pages (Home, SensorData, Monitoring, MaxFlow, etc.)
│   │   └── App.js            # Main application component
├── README.md                 # Project documentation
└── .gitignore
```

## 📥 Prerequisites

- Python 3.8+ for the backend
- Node.js and npm for the frontend
- Git (optional, for cloning the repository)

## 📦 Installation

### Clone the Repository

```bash
git clone https://github.com/Vegeta909/Water-Distribution-Optimizer.git
cd Water-Distribution-Optimizer
```

### Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install flask flask-cors networkx matplotlib numpy pandas
cd ..
```

### Frontend Setup

```bash
cd frontend
npm install
cd ..
```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend
# Activate the virtual environment if not already activated
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

python app.py
```
The backend server will start at http://localhost:5000.

### Start the Frontend Development Server

Open a new terminal window/tab and run:

```bash
cd frontend
npm start
```
The frontend application will open in your browser at http://localhost:3000.

## 📖 Usage Guide

### Home Page
- Overview and navigation to all main features:
  - Sensor Data Analysis
  - Network Monitoring
  - Optimize Water Flow
  - Design Pipelines
  - Route Water

### Sensor Data Analysis
- Visualize real sensor data (pressure, flow) over time.
- Use the **time slider** (1-hour steps) to view the network state at any timestamp.
- See network state visualized with D3, and view statistics and distributions.

### Network Monitoring
- View a dynamic routing network based on sensor data.
- See shortest path distances and routing summaries.
- All edge values are shown with 2 decimal places for clarity.

### Optimize Water Flow (Maximum Flow)
- Enter nodes and connections with capacities.
- Select source and sink nodes.
- Analyze the network to calculate maximum flow and visualize the result.

### Design Pipelines (Minimum Spanning Tree)
- Enter nodes and connections with costs.
- Analyze the network to generate the minimum spanning tree and view the optimized design.

### Route Water (Shortest Path)
- Enter nodes and connections with distances.
- Select source and target nodes.
- Analyze the network to find and visualize the shortest path.

### Network Generation
- Use the generator to create random or example networks for any tool.

## 🧮 Algorithms

- **Maximum Flow**: Ford-Fulkerson algorithm.
- **Minimum Spanning Tree**: Prim's or Kruskal's algorithm.
- **Shortest Path**: Dijkstra's algorithm.
- **Dynamic Routing**: Adaptive routing based on real sensor data.

## 💻 Technologies Used

- **Backend**: Flask, NetworkX, Matplotlib, NumPy, Pandas
- **Frontend**: React, Material-UI, D3.js, Plotly.js
- **Algorithms**: Ford-Fulkerson, Prim's/Kruskal's, Dijkstra's

## 📡 Data

- Place your filtered sensor data as `backend/data/Filtered_Data.csv`.
