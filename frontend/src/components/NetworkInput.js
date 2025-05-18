import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  IconButton,
  Tooltip,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';


function NetworkInput({ onSubmit, title, description, type }) {
  const [nodes, setNodes] = useState('');
  const [edges, setEdges] = useState([{ source: '', target: '', value: '' }]);
  const [source, setSource] = useState('');
  const [sink, setSink] = useState('');
  const [error, setError] = useState('');
  const [nodeList, setNodeList] = useState([]);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [generatorConfig, setGeneratorConfig] = useState({
    reservoirs: 2,
    junctions: 5,
    consumers: 3
  });
  
  useEffect(() => {
    console.log("Current nodes:", nodes);
    console.log("Current edges:", edges);
    console.log("Current source:", source);
    console.log("Current sink:", sink);
  }, [nodes, edges, source, sink]);
  
  // Parse nodes whenever the nodes input changes
  useEffect(() => {
    if (nodes.trim()) {
      const nodeArray = nodes.split(',')
        .map(node => node.trim())
        .filter(node => node);
      setNodeList(nodeArray);
    } else {
      setNodeList([]);
    }
  }, [nodes]); // Make sure 'nodes' is in the dependency array
  
  
  const getValueLabel = () => {
    switch (type) {
      case 'max-flow': return 'Capacity';
      case 'mst': return 'Cost';
      case 'shortest-path': return 'Distance';
      default: return 'Value';
    }
  };
  
  const handleEdgeChange = (index, field, value) => {
    const newEdges = [...edges];
    newEdges[index][field] = value;
    setEdges(newEdges);
  };
  
  const addEdge = () => {
    setEdges([...edges, { source: '', target: '', value: '' }]);
  };
  
  const removeEdge = (index) => {
    const newEdges = [...edges];
    newEdges.splice(index, 1);
    setEdges(newEdges);
  };
  

  const loadSampleData = () => {
    const complexNetwork = {
      nodes: "Reservoir_A, Pump_A, Junction_A, Junction_B, Reservoir_B, Junction_C, Reservoir_C, Pump_B, Junction_D, Reservoir_D",
      edges: [
        { source: "Reservoir_A", target: "Pump_A", value: "800" },
        { source: "Pump_A", target: "Junction_A", value: "600" },
        { source: "Junction_A", target: "Junction_B", value: "500" },
        { source: "Junction_B", target: "Reservoir_B", value: "400" },
        { source: "Junction_A", target: "Junction_C", value: "500" },
        { source: "Junction_C", target: "Reservoir_C", value: "400" },
        { source: "Reservoir_A", target: "Pump_B", value: "800" },
        { source: "Pump_B", target: "Junction_D", value: "600" },
        { source: "Junction_D", target: "Reservoir_D", value: "400" }
      ],
      source: "Reservoir_A",
      sink: type === "max-flow" ? "Reservoir_D" : "Reservoir_C"
    };
  
    // Set nodes as a string
    setNodes(complexNetwork.nodes);
    
    // Replace the entire edges array with the new one
    setEdges(complexNetwork.edges);
    
    // Set source and sink nodes
    setSource(complexNetwork.source);
    setSink(complexNetwork.sink);
    
    // Make sure nodeList gets updated from the nodes string
    // This should happen in a useEffect, but you might need to trigger it manually if it's not working
    const nodeArray = complexNetwork.nodes.split(',')
      .map(node => node.trim())
      .filter(node => node);
    setNodeList(nodeArray);
  };
  
  const generateNetwork = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/generate-network', generatorConfig);
      console.log("Network generation response:", response.data);
      
      // Check the structure of response.data here
      if (!response.data || !response.data.nodes || !response.data.edges) {
        console.error("Invalid network data structure:", response.data);
        setError("Generated network has invalid structure");
        return;
      }
      
      // Process the nodes from the response
      const nodesList = response.data.nodes.map(node => node.id).join(', ');
      
      // Process the edges from the response
      const edgesList = response.data.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        value: edge.capacity || edge.cost || edge.distance || '0'
      }));
      
      // Set the form values
      setNodes(nodesList);
      setEdges(edgesList);
      setSource(response.data.source || '');
      setSink(response.data.sink || '');
      
      setGeneratorOpen(false);
    } catch (error) {
      console.error("Error generating network:", error);
      setError("Failed to generate network: " + (error.response?.data?.error || error.message));
    }
  };
  
  const validateInput = () => {
    // Check if nodes exist
    if (!nodeList.length) {
      setError('Please enter at least one node');
      return false;
    }
    
    // Check if all edges have values
    for (const edge of edges) {
      if (!edge.source || !edge.target || !edge.value) {
        setError(`Please fill all fields for the edge from ${edge.source || 'source'} to ${edge.target || 'target'}`);
        return false;
      }
      
      // Check if edge nodes exist in the node list
      if (!nodeList.includes(edge.source)) {
        setError(`Edge source "${edge.source}" is not in the node list`);
        return false;
      }
      if (!nodeList.includes(edge.target)) {
        setError(`Edge target "${edge.target}" is not in the node list`);
        return false;
      }
      
      // Check if value is a number
      if (isNaN(edge.value)) {
        setError(`${getValueLabel()} must be a number`);
        return false;
      }
    }
    
    // For max-flow and shortest-path, validate source and sink
    if (type === 'max-flow' || type === 'shortest-path') {
      if (!source) {
        setError('Please select a source node');
        return false;
      }
      if (!sink) {
        setError('Please select a sink/target node');
        return false;
      }
      if (source === sink) {
        setError('Source and sink/target nodes must be different');
        return false;
      }
      if (!nodeList.includes(source)) {
        setError(`Source "${source}" is not in the node list`);
        return false;
      }
      if (!nodeList.includes(sink)) {
        setError(`Sink/target "${sink}" is not in the node list`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateInput()) return;
    
    // Format data for the API
    const formattedData = {
      nodes: nodeList.map(id => ({ id })),
      edges: edges.map(edge => {
        const formatted = { 
          source: edge.source, 
          target: edge.target 
        };
        
        switch (type) {
          case 'max-flow':
            formatted.capacity = parseFloat(edge.value);
            break;
          case 'mst':
            formatted.cost = parseFloat(edge.value);
            break;
          case 'shortest-path':
            formatted.distance = parseFloat(edge.value);
            formatted.weight = parseFloat(edge.value); // For Dijkstra's algorithm
            break;
          default:
            formatted.weight = parseFloat(edge.value);
        }
        
        return formatted;
      })
    };
    
    if (type === 'max-flow' || type === 'shortest-path') {
      formattedData.source = source;
      formattedData.sink = sink;
      formattedData.target = sink; // For consistency in API
    }
    
    setError('');
    onSubmit(formattedData);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ flexGrow: 1, fontWeight: 600, color: 'primary.main' }}>
          {title || 'Network Input'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<AutoFixHighIcon />}
            variant="outlined" 
            size="medium"
            onClick={() => setGeneratorOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Generate
          </Button>
          <Button 
            startIcon={<FileUploadIcon />}
            variant="outlined" 
            size="medium"
            onClick={loadSampleData}
            sx={{ borderRadius: 2 }}
          >
            Load Example
          </Button>
        </Box>
      </Box>
      
      {/* Network Generator Dialog */}
      <Dialog open={generatorOpen} onClose={() => setGeneratorOpen(false)}>
        <DialogTitle>Generate Water Distribution Network</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <Typography gutterBottom>Number of Reservoirs</Typography>
          <Slider
            value={generatorConfig.reservoirs}
            min={1}
            max={5}
            step={1}
            marks
            onChange={(e, value) => setGeneratorConfig({...generatorConfig, reservoirs: value})}
            valueLabelDisplay="auto"
          />
          
          <Typography gutterBottom sx={{ mt: 3 }}>Number of Junctions</Typography>
          <Slider
            value={generatorConfig.junctions}
            min={2}
            max={10}
            step={1}
            marks
            onChange={(e, value) => setGeneratorConfig({...generatorConfig, junctions: value})}
            valueLabelDisplay="auto"
          />
          
          <Typography gutterBottom sx={{ mt: 3 }}>Number of Consumers</Typography>
          <Slider
            value={generatorConfig.consumers}
            min={1}
            max={6}
            step={1}
            marks
            onChange={(e, value) => setGeneratorConfig({...generatorConfig, consumers: value})}
            valueLabelDisplay="auto"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGeneratorOpen(false)}>Cancel</Button>
          <Button onClick={generateNetwork} variant="contained">Generate</Button>
        </DialogActions>
      </Dialog>
      
      {description && (
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
                Nodes
              </Typography>
              <Tooltip title="Enter node names separated by commas">
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              key={`nodes-${nodes.length}`}
              fullWidth
              variant="outlined"
              size="medium"
              value={nodes}
              onChange={(e) => setNodes(e.target.value)}
              placeholder="e.g., reservoir1, junction1, consumer1"
              helperText="Enter node names separated by commas"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            {nodeList.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {nodeList.map((node, index) => (
                  <Chip 
                    key={index} 
                    label={node} 
                    size="medium" 
                    color={source === node ? 'success' : sink === node ? 'error' : 'default'} 
                    variant="outlined"
                    sx={{ 
                      borderRadius: 1.5,
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
                  Connections
                </Typography>
                <Tooltip title={`Define connections between nodes with their ${getValueLabel().toLowerCase()}`}>
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Button 
                startIcon={<AddIcon />} 
                size="medium" 
                onClick={addEdge}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Add Connection
              </Button>
            </Box>
            
            {edges.map((edge, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2, 
                  gap: 1,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <FormControl variant="outlined" size="medium" sx={{ minWidth: 120, flexGrow: 1 }}>
                  <InputLabel>From</InputLabel>
                  <Select
                    value={edge.source}
                    onChange={(e) => handleEdgeChange(index, 'source', e.target.value)}
                    label="From"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="" disabled>Select node</MenuItem>
                    {nodeList.map((node, i) => (
                      <MenuItem key={i} value={node}>{node}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl variant="outlined" size="medium" sx={{ minWidth: 120, flexGrow: 1 }}>
                  <InputLabel>To</InputLabel>
                  <Select
                    value={edge.target}
                    onChange={(e) => handleEdgeChange(index, 'target', e.target.value)}
                    label="To"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="" disabled>Select node</MenuItem>
                    {nodeList.map((node, i) => (
                      <MenuItem key={i} value={node}>{node}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label={getValueLabel()}
                  variant="outlined"
                  size="medium"
                  value={edge.value}
                  onChange={(e) => handleEdgeChange(index, 'value', e.target.value)}
                  sx={{ 
                    width: 100,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                  type="number"
                />
                
                <IconButton 
                  onClick={() => removeEdge(index)}
                  color="error"
                  size="medium"
                  disabled={edges.length <= 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Grid>
          
          {(type === 'max-flow' || type === 'shortest-path') && (
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" size="medium">
                  <InputLabel>Source Node</InputLabel>
                  <Select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    label="Source Node"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="" disabled>Select source</MenuItem>
                    {nodeList.map((node, i) => (
                      <MenuItem key={i} value={node}>{node}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" size="medium">
                  <InputLabel>{type === 'max-flow' ? 'Sink Node' : 'Target Node'}</InputLabel>
                  <Select
                    value={sink}
                    onChange={(e) => setSink(e.target.value)}
                    label={type === 'max-flow' ? 'Sink Node' : 'Target Node'}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="" disabled>Select {type === 'max-flow' ? 'sink' : 'target'}</MenuItem>
                    {nodeList.map((node, i) => (
                      <MenuItem key={i} value={node}>{node}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ 
                  px: 5, 
                  py: 1.2, 
                  borderRadius: 2, 
                  fontSize: '1rem',
                  boxShadow: 3
                }}
              >
                Analyze Network
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default NetworkInput;
