import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function SensorDataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/sensor-data')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch sensor data');
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading sensor data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ p: 2 }}>Sensor Data (Filtered)</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Pressure 1</TableCell>
              <TableCell>Pressure 2</TableCell>
              <TableCell>Flow Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.created_at}</TableCell>
                <TableCell>{row['Pressure 1']}</TableCell>
                <TableCell>{row['Pressure 2']}</TableCell>
                <TableCell>{row['Flow rate']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default SensorDataTable; 