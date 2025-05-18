import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Button, CircularProgress } from '@mui/material';
import InputForm from '../components/InputForm';
import GraphVisualizer from '../components/GraphVisualizer';
import axios from 'axios';

function Visualization() {
  const [graphData, setGraphData] = useState(null);
  const [algorithm, setAlgorithm] = useState(null);
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const API_URL = 'http://localhost:5000/api';

  const handleGraphData = (data) => {
    setGraphData(data);
    setHighlightedEdges([]);
    setAlgorithm(null);
  };

  const visualizeMaxFlow = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_URL}/max-flow`, graphData);
      
      // Extract highlighted edges from flow paths
      const edges = [];
      if (response.data.flowPaths) {
        response.data.flowPaths.forEach(path => {
          if (path.path && path.path.length > 1) {
            for (let i = 0; i < path.path.length - 1; i++) {
              edges.push([path.path[i], path.path[i + 1]]);
            }
          }
        });
      }
      
      setHighlightedEdges(edges);
      setAlgorithm('max-flow');
    } catch (err) {
      console.error('Error calculating max flow:', err);
      setError(err.response?.data?.error || 'Failed to visualize maximum flow');
    } finally {
      setLoading(false);
    }
  };

  const visualizeMST = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_URL}/mst`, graphData);
      
      setHighlightedEdges(response.data.mstEdges || []);
      setAlgorithm('mst');
    } catch (err) {
      console.error('Error calculating MST:', err);
      setError(err.response?.data?.error || 'Failed to visualize MST');
    } finally {
      setLoading(false);
    }
  };

  const visualizeShortestPath = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!graphData.source || !graphData.target) {
        setError('Source and target nodes are required for shortest path visualization');
        setLoading(false);
        return;
      }
      
      const response = await axios.post(`${API_URL}/shortest-path`, graphData);
      
      // Extract highlighted edges from path
      const path = response.data.path;
      const edges = [];
      if (path && path.length > 1) {
        for (let i = 0; i < path.length - 1; i++) {
          edges.push([path[i], path[i + 1]]);
        }
      }
      
      setHighlightedEdges(edges);
      setAlgorithm('shortest-path');
    } catch (err) {
      console.error('Error calculating shortest path:', err);
      setError(err.response?.data?.error || 'Failed to visualize shortest path');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Network Visualization
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <InputForm 
            onSubmit={handleGraphData} 
            title="Network Graph Data"
            description="Input your water distribution network data to visualize and analyze."
          />
        </Grid>
        
        {graphData && (
          <Grid item xs={12}>
            <Box display="flex" gap={2} mb={3}>
              <Button 
                variant={algorithm === 'max-flow' ? "contained" : "outlined"} 
                color="primary"
                onClick={visualizeMaxFlow}
                disabled={loading}
              >
                Visualize Max Flow
              </Button>
              <Button 
                variant={algorithm === 'mst' ? "contained" : "outlined"} 
                color="primary"
                onClick={visualizeMST}
                disabled={loading}
              >
                Visualize MST
              </Button>
              <Button 
                variant={algorithm === 'shortest-path' ? "contained" : "outlined"} 
                color="primary"
                onClick={visualizeShortestPath}
                disabled={loading}
              >
                Visualize Shortest Path
              </Button>
            </Box>
            
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" my={2}>{error}</Typography>
            ) : (
              <GraphVisualizer 
                data={graphData} 
                highlightedEdges={highlightedEdges} 
                title={algorithm ? `${algorithm.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Visualization` : 'Network Visualization'}
              />
            )}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Visualization;
