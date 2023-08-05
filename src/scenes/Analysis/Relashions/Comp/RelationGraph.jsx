import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

const RelationGraph = () => {
    const interactions = useSelector((state) => state.textData.freshData.interactions);
    const users = useSelector((state) => state.textData.freshData.user_names);

  const width = 1200;
  const height = 920;
  const dpi = window.devicePixelRatio || 5;
  const canvasRef = useRef(null);

  const usersNamesNodes = () => {
    const nodes = [];
    users.forEach((name, index) => {
        nodes.push({id: name, group: 1}) 
    })
    users.forEach((name, index) => {
        for (let i = 0; i < users.length; i++) {
            if (i < users.length && index !== i) {
                nodes.push({ id: `${users[i]}${index + 2}`, group: index + 2 });
            } else if (index !== i && i === users.length - 1) {
                nodes.push({ id: `${users[0]}${index + 2}`, group: index + 2 });
            }
        }
    });
    return nodes;
  };

  const usersNamesLinks = () => {
    const links = [];
  
    for (let i = 0; i < users.length; i++) {
      if (i < users.length - 1) {
        links.push({ source: users[i], target: users[i + 1], value: 1, arrow: false });
      } else {
        links.push({ source: users[i], target: users[0], value: 1, arrow: false });
      }
    };
    interactions.forEach((item, index) => {
        for (let i = 0; i < users.length; i++) {
            if (item.sender === users[i]) {
                links.push({source: item.sender, target: `${item.recipient}${i + 2}`, value: item.interactionsCount, arrow: true});
            }
        };
    })
    
    return links;
  };

  const data = {
    nodes: usersNamesNodes(),
    links: usersNamesLinks()
  };

useEffect(() => {
    if (!data) return;

    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    // Create a map of node IDs to node objects for easy access.
    const nodeMap = new Map(nodes.map(d => [d.id, d]));

    // Create the links using the nodeMap.
    links.forEach(link => {
      link.source = nodeMap.get(link.source);
      link.target = nodeMap.get(link.target);
    });

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(linkDistance).iterations(10))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', draw);

    function linkDistance(link) {
        // Set the distance based on the groups of source and target nodes
        if (link.source.group === 1 && link.target.group === 1) {
          return 150; // Distance for links within Group 1
        } else {
          return 200; // Distance for links between other groups
        }
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.scale(dpi, dpi);

    function draw() {
      context.clearRect(0, 0, width, height);

      context.save();
      context.globalAlpha = 1;
      context.strokeStyle = '#999';
      context.beginPath();
      links.forEach(drawLink);
      context.stroke();
      context.restore();

      context.save();
      context.strokeStyle = '#fff';
      context.globalAlpha = 1;
      nodes.forEach(node => {
        context.beginPath();
        drawNode(node);
        context.fillStyle = color(node.group);
        context.fill();
        context.stroke();
      });
      context.restore();
    }

    function drawLink(d) {
      const arrowSize = 10;
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const angle = Math.atan2(deltaY, deltaX);
    
      // Set a threshold value to determine strong connections
      const strongConnectionThreshold = 10; // Adjust this value as needed
    
      // Determine the stroke color and line width based on the value
      let strokeColor, lineWidth;
      if (d.value >= strongConnectionThreshold) {
        strokeColor = 'lightblue'; // Use light blue for strong connections
        lineWidth = 4; // Increase the line width for strong connections
      } else {
        strokeColor = '#999';
        lineWidth = d.value * 0.1; // Adjust the line width based on the value for other connections
      }
    
      // Draw the line
      context.beginPath();
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
      context.lineWidth = lineWidth;
      context.strokeStyle = strokeColor;
      context.stroke();
    
      // Draw the arrowhead (if arrow property is true)
      if (d.arrow === true) {
        context.save();
        context.translate(d.target.x, d.target.y);
        context.rotate(angle);
        context.beginPath();
        context.moveTo(-arrowSize, -arrowSize / 2);
        context.lineTo(-arrowSize, arrowSize / 2);
        context.lineTo(0, 0);
        context.fillStyle = strokeColor;
        context.fill();
        context.restore();
      }
    }
    

    function drawNode(d) {
      context.moveTo(d.x + 5, d.y);
      context.arc(d.x, d.y, 5, 0, 2 * Math.PI);
      context.font = "10px Arial";
      context.fillStyle = "#fff";
      context.fillText(d.id, d.x + 8, d.y - 8);
      
    }

   
    // When the component is unmounted, stop the simulation.
    return () => simulation.stop();
  }, [data]);

  return (
    <Box sx={{ overflow: 'visible', padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        width={dpi * width}
        height={dpi * height}
        style={{
          width: '100%',
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      />
    </Box>
  );
};

export default RelationGraph;