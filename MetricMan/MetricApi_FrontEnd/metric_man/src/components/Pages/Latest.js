import React, { useEffect, useState } from 'react';
import CompositionExample from '../GaugeComponent';
import '../Latest.css';
import GPUTemperature from '../GPUTemperature';

const Latest = () => {
    const [cpuUtilization, setCpuUtilization] = useState(null);
    const [gpuUtilization, setGpuUtilization] = useState(null);
    const [gpuTemp, setGpuTemp] = useState(null);
    const [btcPrice, setBtcPrice] = useState(null);
    const [solPrice, setSolPrice] = useState(null);

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    useEffect(() => {
        const fetchData = async (url, setter) => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setter(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData('http://localhost:8081/metrics/recent/LocalPC/cpuutilization', setCpuUtilization);
        fetchData('http://localhost:8081/metrics/recent/LocalPC/gpuutilization', setGpuUtilization);
        fetchData('http://localhost:8081/metrics/recent/LocalPC/gputemp', setGpuTemp);
        fetchData('http://localhost:8081/metrics/recent/CryptoAPI/btcprice', setBtcPrice);
        fetchData('http://localhost:8081/metrics/recent/CryptoAPI/solprice', setSolPrice);
    }, []);

    return (
        <div className="panel">
            <h2>Metrics</h2>
            <div className="metrics-container">
                {/* LocalPC Metrics */}
                <div className="metric-card">
                    <h3>CPU Utilization</h3>
                    {cpuUtilization !== null ? (
                        <>
                            <CompositionExample value={cpuUtilization.value} />
                            <p>Value: {cpuUtilization.value}</p>
                            <p>Timestamp: {formatTimestamp(cpuUtilization.timestamp)}</p>
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
                            <p>Timestamp: {formatTimestamp(gpuUtilization.timestamp)}</p>
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
                            <GPUTemperature temp={gpuTemp.value} />
                            <p>Timestamp: {formatTimestamp(gpuTemp.timestamp)}</p>
                            <p>Unit: {gpuTemp.unit}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                {/* CryptoAPI Metrics */}
                <div className="metric-card price-card">
                    <h3>Bitcoin Price</h3>
                    {btcPrice !== null ? (
                        <>
                            <p className="price">&euro;{btcPrice.value.toFixed(2)}</p>
                            <p>Timestamp: {formatTimestamp(btcPrice.timestamp)}</p>
                            <p>Unit: {btcPrice.unit}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className="metric-card price-card">
                    <h3>Solana Price</h3>
                    {solPrice !== null ? (
                        <>
                            <p className="price">&euro;{solPrice.value.toFixed(2)}</p>
                            <p>Timestamp: {formatTimestamp(solPrice.timestamp)}</p>
                            <p>Unit: {solPrice.unit}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Latest;
