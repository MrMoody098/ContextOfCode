import React, { useEffect, useState } from 'react';
import CompositionExample from './GaugeComponent';
import './CPUMetrics.css';

const CPUMetrics = () => {
    const [cpuTimes, setCpuTimes] = useState(null);
    const [cpuUtilization, setCpuUtilization] = useState(null);

    useEffect(() => {
        const fetchCpuTimes = async () => {
            const response = await fetch('http://localhost:8081/metrics/recent/CPU_Metrics/cputimes');
            const data = await response.json();
            setCpuTimes(data);
        };

        const fetchCpuUtilization = async () => {
            const response = await fetch('http://localhost:8081/metrics/recent/CPU_Metrics/cpuutilization');
            const data = await response.json();
            setCpuUtilization(data);
        };

        fetchCpuTimes();
        fetchCpuUtilization();
    }, []);

    return (
        <div>
            <h2>CPU Metrics</h2>
            <div className="metric-card">
                <h3>CPU Times</h3>
                {cpuTimes !== null ? (
                    <>
                        <CompositionExample value={cpuTimes.value} />
                        <p>Value: {cpuTimes.value}</p>
                        <p>Timestamp: {cpuTimes.timestamp}</p>
                        <p>Unit: {cpuTimes.unit}</p>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
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
        </div>
    );
};

export default CPUMetrics;