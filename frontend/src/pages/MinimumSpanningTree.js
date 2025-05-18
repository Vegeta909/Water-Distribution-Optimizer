import React, { useState } from 'react';
import { Container, Typography, Box, Grid, CircularProgress, Alert, Paper } from '@mui/material';
import NetworkInput from '../components/NetworkInput';
import GraphVisualizer from '../components/GraphVisualizer';
import ResultCard from '../components/ResultCard';
import ProcessSteps from '../components/ProcessSteps';
import axios from 'axios';

function MinimumSpanningTree() {
  const [graphData, setGraphData] = useState(null);
  const [mstResult, setMstResult] = useState(null);
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(-1);
  
  const API_URL = 'http://localhost:5000/api';
  
  const steps = [
    "Enter water network nodes",
    "Define connections with costs",
    "Analyze network",
    "View cost-optimized pipeline design"
  ];

  const calculateMST = async (data) => {
    try {
      setActiveStep(2);
      setLoading(true);
      setError('');
      setGraphData(data);
      
      const response = await axios.post(`${API_URL}/mst`, data);
      
      setMstResult(response.data);
      setHighlightedEdges(response.data.mstEdges || []);
      setActiveStep(3);
    } catch (err) {
      console.error('Error calculating MST:', err);
      setError(err.response?.data?.error || 'Failed to calculate minimum spanning tree');
      setActiveStep(-1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h4" gutterBottom color="primary.main" fontWeight={600}>
      Cost-Effective Pipeline Design
      </Typography>
      <Typography variant="body1">
      Find the most cost-effective way to connect all parts of your water network with minimum investment using minimum spanning tree algorithms.
      </Typography>
    </Paper>
      
      <ProcessSteps steps={steps} activeStep={activeStep} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <NetworkInput 
            onSubmit={calculateMST} 
            title="Water Network Input"
            description="Define your water distribution network with nodes (reservoirs, junctions, consumers) and connections with their implementation costs."
            type="mst"
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
              title="Minimum Spanning Tree Visualization"
              loading={loading}
            />
          )}
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            mstResult && <ResultCard title="Cost-Optimized Network Design" data={mstResult} type="mst" />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default MinimumSpanningTree;
