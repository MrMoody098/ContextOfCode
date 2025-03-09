import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../MoviesList.css';
import NavBar from './NavBar';

const MoviesList = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/metrics/all')
        .then(response => {
          console.log('Metrics fetched:', response.data);
          setMetrics(response.data);
        })
        .catch(error => {
          console.error('Error fetching metrics:', error);
        });
  }, []);

  return (
      <div>
        <NavBar />
        <div className="metrics-container">
          {/*{metrics.map(metric => (*/}
          {/*    <div className="metric-card" key={metric.id}>*/}
          {/*      <h2>Device: {metric.device}</h2>*/}
          {/*      <p>Metric: {metric.metric}</p>*/}
          {/*      <p>Timestamp: {metric.timestamp}</p>*/}
          {/*      <p>Value: {metric.value}</p>*/}
          {/*      <p>Unit: {metric.unit}</p>*/}
          {/*    </div>*/}
          {/*))}*/}
        </div>
      </div>
  );
};

export default MoviesList;