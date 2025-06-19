import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Grid } from '@mui/material';
import Plot from 'react-plotly.js';
import GraphVisualizer from '../components/GraphVisualizer';

function Monitoring() {
  const [routingData, setRoutingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/dynamic-routing')
      .then(res => {
        setRoutingData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch dynamic routing');
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading monitoring data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!routingData) return null;

  // Convert routing table data for visualization
  const nodes = Object.keys(routingData.routing_table);
  const distances = Object.values(routingData.routing_table);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Network Monitoring System
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Network Visualization
              </Typography>
              <GraphVisualizer 
                data={routingData.network}
                title="Dynamic Routing Network"
                loading={loading}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Distance Distribution
              </Typography>
              <Plot
                data={[
                  {
                    type: 'bar',
                    x: nodes,
                    y: distances,
                    marker: {
                      color: 'rgb(55, 83, 109)'
                    }
                  }
                ]}
                layout={{
                  title: 'Distance to Each Node',
                  width: 600,
                  height: 400,
                  xaxis: { title: 'Node' },
                  yaxis: { title: 'Distance' }
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Routing Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(routingData.routing_table).map(([node, distance]) => (
                  <Typography key={node} variant="body1" sx={{ mb: 1 }}>
                    Node {node}: {distance.toFixed(2)} units
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Monitoring; 