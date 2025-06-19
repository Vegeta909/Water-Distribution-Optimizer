import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Grid, Slider } from '@mui/material';
import Plot from 'react-plotly.js';
import GraphVisualizer from '../components/GraphVisualizer';

function SensorData() {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    axios.get('/api/sensor-data')
      .then(res => {
        setSensorData(res.data);
        setSelectedIndex(res.data.length - 1); // Default to latest
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch sensor data');
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading sensor data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!sensorData.length) return null;

  // Prepare data for visualization
  const timestamps = sensorData.map(d => d.created_at);
  const pressure1Data = sensorData.map(d => d['Pressure 1']);
  const pressure2Data = sensorData.map(d => d['Pressure 2']);
  const flowRateData = sensorData.map(d => d['Flow rate']);

  // Calculate statistics
  const avgPressure1 = pressure1Data.reduce((a, b) => a + b, 0) / pressure1Data.length;
  const avgPressure2 = pressure2Data.reduce((a, b) => a + b, 0) / pressure2Data.length;
  const avgFlowRate = flowRateData.reduce((a, b) => a + b, 0) / flowRateData.length;

  // Time slider logic (1 hour step)
  // Assume timestamps are sorted and in ISO format
  const marks = timestamps.map((t, i) => {
    if (!t) return null;
    if (
      i === 0 ||
      i === timestamps.length - 1 ||
      (i > 0 && timestamps[i - 1] && new Date(t).getHours() !== new Date(timestamps[i - 1]).getHours())
    ) {
      return { value: i, label: typeof t === 'string' ? t.slice(11, 16) : '' };
    }
    return null;
  }).filter(Boolean);

  const handleSliderChange = (event, newValue) => {
    setSelectedIndex(newValue);
  };

  // Use selected row for network visualization
  const row = sensorData[selectedIndex];
  const networkData = {
    nodes: [
      { id: 'source', type: 'source', x: 30, y: 50 },
      { id: 'junction1', type: 'junction', x: 50, y: 30 },
      { id: 'junction2', type: 'junction', x: 50, y: 70 },
      { id: 'sink', type: 'sink', x: 70, y: 50 }
    ],
    edges: [
      { 
        source: 'source', 
        target: 'junction1',
        value: row['Pressure 1']?.toFixed(2)
      },
      { 
        source: 'source', 
        target: 'junction2',
        value: row['Pressure 2']?.toFixed(2)
      },
      { 
        source: 'junction1', 
        target: 'sink',
        value: (row['Flow rate'] / 2)?.toFixed(2)
      },
      { 
        source: 'junction2', 
        target: 'sink',
        value: (row['Flow rate'] / 2)?.toFixed(2)
      }
    ],
    source: 'source',
    sink: 'sink'
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sensor Data Analysis
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Network State Visualization
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Timestamp: {row.created_at}
                </Typography>
                <Slider
                  value={selectedIndex}
                  min={0}
                  max={sensorData.length - 1}
                  step={1}
                  marks={marks}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  sx={{ mt: 2 }}
                />
              </Box>
              <GraphVisualizer 
                data={networkData}
                title="Current Network State"
                loading={loading}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pressure and Flow Rate Over Time
              </Typography>
              <Plot
                data={[
                  {
                    x: timestamps,
                    y: pressure1Data,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Pressure 1',
                    line: { color: 'rgb(31, 119, 180)' }
                  },
                  {
                    x: timestamps,
                    y: pressure2Data,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Pressure 2',
                    line: { color: 'rgb(255, 127, 14)' }
                  },
                  {
                    x: timestamps,
                    y: flowRateData,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Flow Rate',
                    yaxis: 'y2',
                    line: { color: 'rgb(44, 160, 44)' }
                  }
                ]}
                layout={{
                  title: 'Sensor Measurements Over Time',
                  width: 800,
                  height: 500,
                  xaxis: { title: 'Time' },
                  yaxis: { title: 'Pressure' },
                  yaxis2: {
                    title: 'Flow Rate',
                    overlaying: 'y',
                    side: 'right'
                  }
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pressure Distribution
              </Typography>
              <Plot
                data={[
                  {
                    x: pressure1Data,
                    type: 'histogram',
                    name: 'Pressure 1',
                    opacity: 0.7
                  },
                  {
                    x: pressure2Data,
                    type: 'histogram',
                    name: 'Pressure 2',
                    opacity: 0.7
                  }
                ]}
                layout={{
                  title: 'Pressure Distribution',
                  width: 600,
                  height: 400,
                  barmode: 'overlay',
                  xaxis: { title: 'Pressure' },
                  yaxis: { title: 'Count' }
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Statistics
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Average Pressure 1: {avgPressure1.toFixed(2)} units
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Average Pressure 2: {avgPressure2.toFixed(2)} units
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Average Flow Rate: {avgFlowRate.toFixed(2)} units
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Total Measurements: {sensorData.length}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default SensorData; 