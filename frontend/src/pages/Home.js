import React from 'react';
import { Container, Typography, Paper, Box, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import OpacityIcon from '@mui/icons-material/Opacity';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RouteIcon from '@mui/icons-material/Route';
import TimelineIcon from '@mui/icons-material/Timeline';
import MonitorIcon from '@mui/icons-material/Monitor';
import ProcessSteps from '../components/ProcessSteps';

function Home() {
  const steps = [
    "Enter your water network nodes",
    "Define connections and values",
    "Choose optimization algorithm",
    "View optimized results"
  ];

  const featureBoxes = [
    {
      title: "Sensor Data Analysis",
      icon: <TimelineIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      description: "View and analyze real-time sensor data from your water distribution network.",
      buttonText: "View Sensors",
      linkTo: "/sensor-data"
    },
    {
      title: "Network Monitoring",
      icon: <MonitorIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      description: "Monitor your network's dynamic routing and performance metrics in real-time.",
      buttonText: "Monitor Network",
      linkTo: "/monitoring"
    },
    {
      title: "Optimize Water Flow",
      icon: <OpacityIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      description: "Maximize the amount of water that can flow through your distribution network.",
      buttonText: "Analyze Flow",
      linkTo: "/max-flow"
    },
    {
      title: "Design Pipelines",
      icon: <AccountTreeIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      description: "Find the most cost-effective way to connect all parts of your water network.",
      buttonText: "Design Network",
      linkTo: "/minimum-spanning-tree"
    },
    {
      title: "Route Water",
      icon: <RouteIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      description: "Calculate the most efficient routes for water distribution between points.",
      buttonText: "Find Routes",
      linkTo: "/shortest-path"
    }
  ];

  const algorithmInfoBoxes = [
    {
      title: "Sensor Data Monitoring",
      description: "Real-time monitoring of pressure and flow rate data from network sensors."
    },
    {
      title: "Dynamic Network Routing",
      description: "Adaptive routing based on current network conditions and sensor readings."
    },
    {
      title: "Maximum Flow Analysis",
      description: "Uses the Ford-Fulkerson algorithm to calculate the maximum water flow."
    },
    {
      title: "Minimum Spanning Tree",
      description: "Implements Prim's or Kruskal's algorithm for cost-effective network design."
    },
    {
      title: "Shortest Path Finding",
      description: "Applies Dijkstra's algorithm to determine efficient water distribution routes."
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700} color="primary.main">
          Water Distribution Optimizer
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: '800px', mx: 'auto' }}>
          Optimize water flow, monitor network performance, and find efficient distribution routes using advanced algorithms
        </Typography>
      </Box>

      <ProcessSteps steps={steps} />

      {/* Feature Boxes */}
      <Grid container spacing={4} sx={{ mb: 6 }} alignItems="stretch">
        {featureBoxes.map((feature, index) => (
          <Grid item xs={12} md={4} key={index} sx={{ height: '100%' }}>
            <Paper
              elevation={3}
              sx={{
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ bgcolor: 'primary.light', py: 2, px: 3 }}>
                <Typography variant="h6" color="primary.dark" fontWeight={600}>
                  {feature.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
                    {feature.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    component={RouterLink}
                    to={feature.linkTo}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: 500,
                      minWidth: '160px'
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Algorithm Info Boxes */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 6, bgcolor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom color="primary.main" fontWeight={600}>
          About the Project
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          The Water Distribution Optimizer is an educational tool designed to demonstrate how graph algorithms and real-time monitoring can be applied to optimize water distribution networks in smart cities.
        </Typography>
        <Grid container spacing={3} alignItems="stretch">
          {algorithmInfoBoxes.map((algorithm, index) => (
            <Grid item xs={12} md={4} key={index} sx={{ height: '100%' }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.dark" sx={{ mb: 2 }}>
                  {algorithm.title}
                </Typography>
                <Typography variant="body2">
                  {algorithm.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default Home;
