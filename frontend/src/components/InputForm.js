import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';

function InputForm({ onSubmit, title, description }) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonInput);
      
      // Basic validation
      if (!parsedData.nodes || !Array.isArray(parsedData.nodes) || 
          !parsedData.edges || !Array.isArray(parsedData.edges)) {
        throw new Error('Input must contain "nodes" and "edges" arrays');
      }
      
      onSubmit(parsedData);
      setError('');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {title || 'Graph Input'}
      </Typography>
      
      {description && (
        <Typography variant="body2" color="textSecondary" paragraph>
          {description}
        </Typography>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={8}
          label="JSON Graph Data"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`{
  "nodes": [
    { "id": "reservoir1", "type": "source" },
    { "id": "junction1", "type": "junction" },
    { "id": "consumer1", "type": "sink" }
  ],
  "edges": [
    { "source": "reservoir1", "target": "junction1", "capacity": 100, "cost": 5 },
    { "source": "junction1", "target": "consumer1", "capacity": 50, "cost": 3 }
  ],
  "source": "reservoir1",
  "sink": "consumer1"
}`}
          variant="outlined"
          margin="normal"
          error={Boolean(error)}
          helperText={error}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
        >
          Process Graph
        </Button>
      </form>

      <Box mt={2}>
        <Typography variant="subtitle2">
          Sample inputs:
        </Typography>
        <Button 
          size="small" 
          onClick={() => setJsonInput(`{
  "nodes": [
    { "id": "reservoir1", "type": "source" },
    { "id": "junction1", "type": "junction" },
    { "id": "junction2", "type": "junction" },
    { "id": "consumer1", "type": "sink" }
  ],
  "edges": [
    { "source": "reservoir1", "target": "junction1", "capacity": 100, "cost": 5 },
    { "source": "reservoir1", "target": "junction2", "capacity": 80, "cost": 6 },
    { "source": "junction1", "target": "junction2", "capacity": 40, "cost": 2 },
    { "source": "junction1", "target": "consumer1", "capacity": 70, "cost": 4 },
    { "source": "junction2", "target": "consumer1", "capacity": 60, "cost": 3 }
  ],
  "source": "reservoir1",
  "sink": "consumer1"
}`)}
        >
          Load Sample Data
        </Button>
      </Box>
    </Paper>
  );
}

export default InputForm;
