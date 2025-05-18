import React from 'react';
import { Typography, Box, Chip, Paper } from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import RouteIcon from '@mui/icons-material/Route';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

function ResultCard({ title, data, type }) {
  const getIcon = () => {
    switch (type) {
      case 'max-flow':
        return <OpacityIcon color="primary" />;
      case 'mst':
        return <AccountTreeIcon color="primary" />;
      case 'shortest-path':
        return <RouteIcon color="primary" />;
      default:
        return null;
    }
  };

  const renderMaxFlowResult = () => {
    if (!data || !data.maxFlow) return <Typography>No results available yet</Typography>;
    
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <OpacityIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" color="primary.main" fontWeight={600}>
            Maximum Flow: <strong>{data.maxFlow}</strong> units
          </Typography>
        </Box>
        
        {data.flowPaths && data.flowPaths.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
              Flow Distribution
            </Typography>
            {data.flowPaths.map((path, idx) => (
              <Paper 
                key={idx} 
                elevation={1} 
                sx={{ 
                  mt: 1, 
                  p: 2, 
                  borderRadius: 2,
                  backgroundColor: '#f5f5f5',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Path {idx + 1}
                  </Typography>
                  <Chip 
                    label={`Flow: ${path.flow} units`} 
                    color="primary" 
                    size="medium" 
                    variant="outlined" 
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                  {path.path.join(' → ')}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </>
    );
  };

  const renderMSTResult = () => {
    if (!data || !data.mstEdges) return <Typography>No results available yet</Typography>;
    
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccountTreeIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" color="primary.main" fontWeight={600}>
            Total Cost: <strong>{data.totalCost}</strong> units
          </Typography>
        </Box>
        
        {data.mstEdges && data.mstEdges.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
              Optimal Pipeline Connections
            </Typography>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {data.mstEdges.map((edge, idx) => (
                  <Chip 
                    key={idx} 
                    label={`${edge[0]} ↔ ${edge[1]}`} 
                    variant="outlined" 
                    color="primary"
                    size="medium"
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        )}
      </>
    );
  };

  const renderShortestPathResult = () => {
    if (!data || !data.path) return <Typography>No results available yet</Typography>;
    
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <RouteIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" color="primary.main" fontWeight={600}>
            Shortest Distance: <strong>{data.distance}</strong> units
          </Typography>
        </Box>
        
        {data.path && data.path.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
              Optimal Route
            </Typography>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                {data.path.join(' → ')}
              </Typography>
            </Paper>
          </Box>
        )}
      </>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'max-flow':
        return renderMaxFlowResult();
      case 'mst':
        return renderMSTResult();
      case 'shortest-path':
        return renderShortestPathResult();
      default:
        return <Typography>Unknown result type</Typography>;
    }
  };

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2, bgcolor: 'background.paper' }}>
      <Box sx={{ bgcolor: 'primary.light', py: 2, px: 3 }}>
        <Typography variant="h6" color="primary.dark" fontWeight={600}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 4 }}>
        {renderContent()}
      </Box>
    </Paper>
  );
}

export default ResultCard;
