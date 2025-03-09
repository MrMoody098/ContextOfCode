import React, { useEffect, useState } from 'react';
import CompositionExample from './GaugeComponent';
import './CPUMetrics.css';

const CPUMetrics = () => {
    const [cpuUtilization, setCpuUtilization] = useState(null);
    const [gpuUtilization, setGpuUtilization] = useState(null);
    const [gpuTemp, setGpuTemp] = useState(null);

    useEffect(() => {
        const fetchCpuUtilization = async () => {
            const response = await fetch('http://localhost:8081/metrics/recent/LocalPC/cpuutilization');
            const data = await response.json();
            setCpuUtilization(data);
        };

        const fetchGpuUtilization = async () => {
            const response = await fetch('http://localhost:8081/metrics/recent/LocalPC/gpuutilization');
            const data = await response.json();
            setGpuUtilization(data);
        };

        const fetchGpuTemp = async () => {
            const response = await fetch('http://localhost:8081/metrics/recent/LocalPC/gputemp');
            const data = await response.json();
            setGpuTemp(data);
        };

        fetchCpuUtilization();
        fetchGpuUtilization();
        fetchGpuTemp();
    }, []);

    return (
        <div className="panel">
            <h2>Metrics</h2>
            <div className="metrics-container">
                <div className="metric-card">
                    <h3>CPU Utilization</h3>
                    {cpuUtilization !== null ? (
                        <>
                            <CompositionExample value={cpuUtilization.value} />
                            <p>Value: {cpuUtilization.value}</p>
                            <p>Timestamp: {cpuUtilization.timestamp}</p>
                            <p>Unit: {cpuUtilization.unit}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className="metric-card">
                    <h3>GPU Utilization</h3>
                    {gpuUtilization !== null ? (
                        <>
                            <CompositionExample value={gpuUtilization.value} />
                            <p>Value: {gpuUtilization.value}</p>
                            <p>Timestamp: {gpuUtilization.timestamp}</p>
                            <p>Unit: {gpuUtilization.unit}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className="metric-card">
                    <h3>GPU Temperature</h3>
                    {gpuTemp !== null ? (
                        <>
                            <CompositionExample value={gpuTemp.value} />
                            <p>Value: {gpuTemp.value}</p>
                            <p>Timestamp: {gpuTemp.timestamp}</p>
                            <p>Unit: {gpuTemp.unit}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CPUMetrics;