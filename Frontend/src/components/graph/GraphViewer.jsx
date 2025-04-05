import React, { useEffect, useRef } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { useNavigate } from 'react-router-dom';

const GraphViewer = ({ notebooks = [], topics = [], resources = [] }) => {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const rendererRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!notebooks.length && !topics.length && !resources.length) {
      return;
    }

    try {
      const graph = new Graph();

      // Add notebook nodes first
      notebooks.forEach(notebook => {
        if (notebook?._id && notebook?.name) {
          graph.addNode(notebook._id, {
            label: notebook.name,
            size: 15,
            color: '#7D4FFF',
            type: 'notebook',
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50
          });
        }
      });

      // Add topic nodes and edges
      topics.forEach(topic => {
        if (topic?._id && topic?.title && topic?.folderId) {
          graph.addNode(topic._id, {
            label: topic.title,
            size: 10,
            color: '#6a43d9',
            type: 'topic',
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50
          });

          // Only add edge if both nodes exist
          if (graph.hasNode(topic.folderId)) {
            graph.addEdge(topic.folderId, topic._id, {
              type: 'topic-notebook',
              size: 2,
              color: '#ddd'
            });
          }
        }
      });

      // Add resource nodes and edges
      resources.forEach(resource => {
        if (resource?._id && resource?.topicId) {
          graph.addNode(resource._id, {
            label: resource.title || 'Resource',
            size: 5,
            color: '#FF4F5B',
            type: 'resource',
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50
          });

          // Only add edge if both nodes exist
          if (graph.hasNode(resource.topicId)) {
            graph.addEdge(resource.topicId, resource._id, {
              type: 'resource-topic',
              size: 1,
              color: '#eee'
            });
          }
        }
      });

      // Apply layout
      const sensibleSettings = forceAtlas2.inferSettings(graph);
      forceAtlas2.assign(graph, {
        iterations: 100,
        settings: {
          ...sensibleSettings,
          gravity: 2,
          scalingRatio: 10,
          strongGravityMode: true,
          slowDown: 1
        }
      });

      // Initialize renderer with fixed program settings
      if (containerRef.current) {
        rendererRef.current = new Sigma(graph, containerRef.current, {
          minCameraRatio: 0.1,
          maxCameraRatio: 10,
          labelColor: { color: '#000' },
          nodeHoverColor: '#000',
          defaultNodeColor: '#999',
          defaultEdgeColor: '#eee',
          renderLabels: true,
          labelSize: 12,
          labelWeight: 'bold',
          defaultNodeType: 'circle',
          defaultEdgeType: 'line',
          // Node reducer
          nodeReducer: (_, data) => {
            if (!data) {
              return {
                size: 5,
                color: '#999',
                label: '',
                type: 'circle'
              };
            }

            const highlighted = data.highlighted || false;
            return {
              ...data,
              size: (data.size || 5) * (highlighted ? 2.5 : 2),
              color: highlighted ? '#000' : (data.color || '#999'),
              label: data.label || '',
              type: 'circle',
              zIndex: highlighted ? 1 : 0
            };
          },
          // Edge reducer
          edgeReducer: (edge, data) => {
            if (!edge || !data) {
              return {
                size: 1,
                color: '#eee',
                type: 'line'
              };
            }

            try {
              const source = graph.hasNode(edge.source) ? graph.getNodeAttributes(edge.source) : null;
              const target = graph.hasNode(edge.target) ? graph.getNodeAttributes(edge.target) : null;
              
              const highlighted = (source?.highlighted || target?.highlighted) || false;
              
              return {
                ...data,
                size: data.size || 1,
                color: highlighted ? '#000' : (data.color || '#eee'),
                type: 'line'
              };
            } catch (error) {
              console.error('Error in edgeReducer:', error);
              return {
                size: 1,
                color: '#eee',
                type: 'line'
              };
            }
          }
        });

        // Add interactions
        rendererRef.current.on('enterNode', (event) => {
          const node = event.node;
          if (graph.hasNode(node)) {
            graph.setNodeAttribute(node, 'highlighted', true);
            rendererRef.current.refresh();
          }
        });

        rendererRef.current.on('leaveNode', (event) => {
          const node = event.node;
          if (graph.hasNode(node)) {
            graph.setNodeAttribute(node, 'highlighted', false);
            rendererRef.current.refresh();
          }
        });

        rendererRef.current.on('clickNode', (event) => {
          const node = event.node;
          const attrs = graph.getNodeAttributes(node);
          
          if (attrs?.type) {
            switch(attrs.type) {
              case 'notebook':
                navigate(`/dashboard/notebook/${node}`);
                break;
              case 'topic':
                navigate(`/dashboard/topic/${node}`);
                break;
              case 'resource':
                navigate(`/dashboard/resource/${node}`);
                break;
            }
          }
        });
      }
    } catch (error) {
      console.error('Error initializing graph:', error);
    }

    return () => {
      if (rendererRef.current) {
        rendererRef.current.kill();
      }
    };
  }, [notebooks, topics, resources, navigate]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-xl shadow-sm"
      style={{ 
        background: 'linear-gradient(135deg, #7D4FFF20 0%, #7D4FFF10 100%)',
      }}
    >
      {(!notebooks.length && !topics.length && !resources.length) && (
        <div className="flex justify-center items-center h-full text-gray-500">
          No data to visualize
        </div>
      )}
    </div>
  );
};

export default GraphViewer;