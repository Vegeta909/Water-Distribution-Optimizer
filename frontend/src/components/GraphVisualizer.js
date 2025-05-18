import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Paper, Typography, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function GraphVisualizer({ data, highlightedEdges = [], title = "Network Visualization", loading = false }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !data.nodes || !data.edges || data.nodes.length === 0 || loading) return;

    const width = 700;
    const height = 500;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    
    // Add definitions for arrow markers
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20) // Increased to accommodate larger nodes
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#666")
      .attr("d", "M0,-5L10,0L0,5");
    
    // Function to determine node type from id or type property
    const getNodeType = (node) => {
      if (node.type) return node.type;
      
      const id = node.id.toLowerCase();
      if (id.includes('reservoir')) return 'reservoir';
      if (id.includes('pump')) return 'pump';
      if (id.includes('junction')) return 'junction';
      if (id.includes('consumer')) return 'consumer';
      if (node.id === data.source) return 'reservoir';
      if (node.id === data.sink) return 'consumer';
      
      return 'junction';
    };
    
    // Assign node types and enhance data
    data.nodes.forEach(node => {
      node.nodeType = getNodeType(node);
    });
    
    // Create the force simulation with stronger forces
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.edges)
        .id(d => d.id)
        .distance(120)) // Increased distance for better spacing
      .force("charge", d3.forceManyBody().strength(-800)) // Stronger repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));
    
    // Create a group for the edges
    const link = svg.append("g")
      .selectAll("path")
      .data(data.edges)
      .join("path")
      .attr("stroke", d => {
        const isHighlighted = highlightedEdges.some(edge => 
          (edge[0] === d.source.id && edge[1] === d.target.id) || 
          (edge[0] === d.target.id && edge[1] === d.source.id)
        );
        return isHighlighted ? "#ff3d00" : "#666";
      })
      .attr("stroke-width", d => {
        const isHighlighted = highlightedEdges.some(edge => 
          (edge[0] === d.source.id && edge[1] === d.target.id) || 
          (edge[0] === d.target.id && edge[1] === d.source.id)
        );
        return isHighlighted ? 4 : 2;
      })
      .attr("fill", "none")
      .attr("marker-end", "url(#arrow)");
    
    // Create edge labels with units
    const edgeLabels = svg.append("g")
      .selectAll("text")
      .data(data.edges)
      .join("text")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dy", -8)
      .attr("fill", "#444")
      .attr("font-weight", "500")
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("stroke-width", "3px")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .text(d => {
        let label = "";
        
        // Add capacity with units
        if (d.capacity) {
          label += `${d.capacity} L/s`;
        }
        
        // Add cost if available
        if (d.cost && d.capacity) {
          label += ` / $${d.cost}`;
        } else if (d.cost) {
          label += `$${d.cost}`;
        }
        
        // Add distance if that's the only value
        if (d.distance && !d.cost && !d.capacity) {
          label += `${d.distance} m`;
        }
        
        // Handle the value property from your input form
        if (d.value && !label) {
          label = d.value;
        }
        
        return label;
      });
    
    // Create a group for the nodes
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g");
    
    // Color scale for node types
    const nodeColors = {
      reservoir: "#2196f3", // Blue for reservoirs
      pump: "#4caf50",      // Green for pumps
      junction: "#f44336",  // Red for junctions
      consumer: "#ff9800",  // Orange for consumers
      source: "#2196f3",    // Blue for source (same as reservoir)
      sink: "#ff9800"       // Orange for sink (same as consumer)
    };
    
    // Node size based on type
    const nodeSize = d => {
      switch(d.nodeType) {
        case 'reservoir': return 15;
        case 'pump': return 12;
        case 'consumer': return 13;
        case 'junction': return 10;
        default: return 10;
      }
    };
    
    // Node shape based on type
    const addNodeShape = (selection) => {
      selection.each(function(d) {
        const node = d3.select(this);
        const size = nodeSize(d);
        
        switch(d.nodeType) {
          case 'reservoir':
            // Circle for reservoir
            node.append("circle")
              .attr("r", size)
              .attr("fill", nodeColors[d.nodeType])
              .attr("stroke", "#fff")
              .attr("stroke-width", 2);
            break;
            
          case 'pump':
            // Diamond for pump
            node.append("rect")
              .attr("width", size * 1.8)
              .attr("height", size * 1.8)
              .attr("transform", `rotate(45) translate(${-size * 0.9}, ${-size * 0.9})`)
              .attr("fill", nodeColors[d.nodeType])
              .attr("stroke", "#fff")
              .attr("stroke-width", 2);
            break;
            
          case 'consumer':
            // Hexagon for consumer
            const hexagonPoints = [];
            for (let i = 0; i < 6; i++) {
              const angle = (i * Math.PI) / 3;
              hexagonPoints.push([size * Math.cos(angle), size * Math.sin(angle)]);
            }
            
            node.append("polygon")
              .attr("points", hexagonPoints.map(p => p.join(",")).join(" "))
              .attr("fill", nodeColors[d.nodeType])
              .attr("stroke", "#fff")
              .attr("stroke-width", 2);
            break;
            
          default:
            // Square for junction
            node.append("rect")
              .attr("width", size * 1.5)
              .attr("height", size * 1.5)
              .attr("transform", `translate(${-size * 0.75}, ${-size * 0.75})`)
              .attr("fill", nodeColors[d.nodeType])
              .attr("stroke", "#fff")
              .attr("stroke-width", 2);
        }
        
        // Add a highlight circle if this is source or sink
        if (d.id === data.source || d.id === data.sink) {
          node.append("circle")
            .attr("r", size + 5)
            .attr("fill", "none")
            .attr("stroke", d.id === data.source ? "#4caf50" : "#f44336")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,3")
            .attr("opacity", 0.8);
        }
      });
      
      return selection;
    };
    
    // Add nodes with shapes based on type
    nodeGroup
      .call(addNodeShape)
      .call(drag(simulation));
    
    // Add labels to nodes
    nodeGroup.append("text")
      .text(d => d.id)
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("dx", d => nodeSize(d) + 5)
      .attr("dy", 4)
      .attr("fill", "#333")
      .attr("stroke", "white")
      .attr("stroke-width", "3px")
      .attr("paint-order", "stroke")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");
    
    // Add legend
    const legend = svg.append("g")
      .attr("transform", "translate(20, 20)");
    
    const legendItems = [
      { type: "reservoir", label: "Reservoir" },
      { type: "pump", label: "Pump" },
      { type: "junction", label: "Junction" },
      { type: "consumer", label: "Consumer" }
    ];
    
    legendItems.forEach((item, i) => {
      const legendGroup = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);
      
      // Add colored rectangle
      legendGroup.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", nodeColors[item.type])
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);
      
      // Add label
      legendGroup.append("text")
        .attr("x", 25)
        .attr("y", 12)
        .attr("font-size", "12px")
        .text(item.label);
    });
    
    // Add title for hover tooltip
    nodeGroup.append("title")
      .text(d => `${d.id}\nType: ${d.nodeType}`);
    
    // Update positions on each tick
    simulation.on("tick", () => {
      link.attr("d", d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Curve factor
        
        // Draw curved paths
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });
      
      edgeLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);
      
      nodeGroup.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });
    
    // Drag functionality
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
    
    return () => {
      simulation.stop();
    };
  }, [data, highlightedEdges, loading]);

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom color="primary.main" fontWeight={600}>
        {title}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '500px', // Increased height for better visualization
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        {loading ? (
          <CircularProgress />
        ) : !data?.nodes ? (
          <Typography variant="body2" color="text.secondary">
            No graph data to display. Please input network data first.
          </Typography>
        ) : (
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
        )}
      </Box>
      
      {/* Legend for edge highlighting */}
      {highlightedEdges.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 20, height: 3, bgcolor: '#ff3d00', mr: 1 }}></Box>
          <Typography variant="body2" color="text.secondary">
            Highlighted path
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default GraphVisualizer;
