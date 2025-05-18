import React, { useState } from 'react';
import { Container, Typography, Box, Grid, CircularProgress, Alert, Paper } from '@mui/material';
import NetworkInput from '../components/NetworkInput';
import GraphVisualizer from '../components/GraphVisualizer';
import ResultCard from '../components/ResultCard';
import ProcessSteps from '../components/ProcessSteps';
import axios from 'axios';

function ShortestPath() {
  const [graphData, setGraphData] = useState(null);
  const [shortestPathResult, setShortestPathResult] = useState(null);
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(-1);
  
  const API_URL = 'http://localhost:5000/api';
  
  const steps = [
    "Enter water network nodes",
    "Define connections with distances",
    "Select source and target nodes",
    "View optimized water routing"
  ];

  const calculateShortestPath = async (data) => {
    try {
      setActiveStep(2);
      setLoading(true);
      setError('');
      setGraphData(data);
      
      const response = await axios.post(`${API_URL}/shortest-path`, data);
      
      // Extract highlighted edges from path
      const path = response.data.path;
      const edges = [];
      if (path && path.length > 1) {
        for (let i = 0; i < path.length - 1; i++) {
          edges.push([path[i], path[i + 1]]);
        }
      }
      
      setShortestPathResult(response.data);
      setHighlightedEdges(edges);
      setActiveStep(3);
    } catch (err) {
      console.error('Error calculating shortest path:', err);
      setError(err.response?.data?.error || 'Failed to calculate shortest path');
      setActiveStep(-1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
  <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
    <Typography variant="h4" gutterBottom color="primary.main" fontWeight={600}>
    Efficient Water Routing
    </Typography>
    <Typography variant="body1">
    Calculate the most efficient route for water distribution between any two points in your network using Dijkstra's algorithm.
    </Typography>
  </Paper>
      
      <ProcessSteps steps={steps} activeStep={activeStep} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <NetworkInput 
            onSubmit={calculateShortestPath} 
            title="Water Network Input"
            description="Define your water distribution network with nodes (reservoirs, junctions, consumers) and connections with their distances or travel times."
            type="shortest-path"
          />
        </Grid>
        
        <Grid item xs={12} lg={6}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          {graphData && (
            <GraphVisualizer 
              data={graphData} 
              highlightedEdges={highlightedEdges} 
              title="Shortest Path Visualization"
              loading={loading}
            />
          )}
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            shortestPathResult && <ResultCard title="Optimal Water Routing" data={shortestPathResult} type="shortest-path" />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default ShortestPath;
