import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

function DynamicRouting() {
  const [routing, setRouting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/dynamic-routing')
      .then(res => {
        setRouting(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch dynamic routing');
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading dynamic routing...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!routing) return null;

  return (
    <Paper sx={{ mb: 4, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Dynamic Routing Table</Typography>
      <List>
        {Object.entries(routing.routing_table).map(([node, dist]) => (
          <ListItem key={node}>
            <ListItemText primary={`${node}: ${dist.toFixed(2)}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default DynamicRouting; 