import React, { useState } from 'react';
import { Container, Typography, Box, Grid, CircularProgress, Alert, Paper } from '@mui/material';
import NetworkInput from '../components/NetworkInput';
import GraphVisualizer from '../components/GraphVisualizer';
import ResultCard from '../components/ResultCard';
import ProcessSteps from '../components/ProcessSteps';
import axios from 'axios';

function MaxFlow() {
  const [graphData, setGraphData] = useState(null);
  const [maxFlowResult, setMaxFlowResult] = useState(null);
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(-1);
  
  const API_URL = 'http://localhost:5000/api';
  
  const steps = [
    "Enter water network nodes",
    "Define connections with capacities",
    "Select source and sink nodes",
    "View maximum flow results"
  ];

  const calculateMaxFlow = async (data) => {
    try {
      setActiveStep(2);
      setLoading(true);
      setError('');
      setGraphData(data);
      
      const response = await axios.post(`${API_URL}/max-flow`, data);
      
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
      
      setMaxFlowResult(response.data);
      setHighlightedEdges(edges);
      setActiveStep(3);
    } catch (err) {
      console.error('Error calculating max flow:', err);
      setError(err.response?.data?.error || 'Failed to calculate maximum flow');
      setActiveStep(-1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
  <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
    <Typography variant="h4" gutterBottom color="primary.main" fontWeight={600}>
    Optimize Water Flow
    </Typography>
    <Typography variant="body1">
    Calculate the maximum amount of water that can flow through your distribution network from source to destination using the Ford-Fulkerson algorithm.
    </Typography>
  </Paper>
      
      <ProcessSteps steps={steps} activeStep={activeStep} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <NetworkInput 
            onSubmit={calculateMaxFlow} 
            title="Water Network Input"
            description="Define your water distribution network with nodes (reservoirs, junctions, consumers) and connections with their flow capacities."
            type="max-flow"
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
              title="Network Flow Visualization"
              loading={loading}
            />
          )}
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            maxFlowResult && <ResultCard title="Maximum Flow Analysis" data={maxFlowResult} type="max-flow" />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default MaxFlow;
