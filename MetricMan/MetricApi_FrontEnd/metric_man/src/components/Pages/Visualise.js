import React, { useEffect, useState } from 'react';
import TimeSeriesGraph from '../TimeSeriesGraph';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Visualise = () => {
    const [gputempData, setGputempData] = useState({ labels: [], values: [] });
    const [cpuUtilData, setCpuUtilData] = useState({ labels: [], values: [] });
    const [gpuUtilData, setGpuUtilData] = useState({ labels: [], values: [] });
    const [btcPriceData, setBtcPriceData] = useState({ labels: [], values: [] });
    const [solPriceData, setSolPriceData] = useState({ labels: [], values: [] });
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        const fetchMetricData = async (metricType, device) => {
            let url = `http://localhost:8081/metrics/history/device/metric/${device}/${metricType}`;
            if (startDate && endDate) {
                url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            }
            const response = await fetch(url);
            const result = await response.json();
            return {
                labels: result.map(item => new Date(item.timestamp).toLocaleString()),
                values: result.map(item => item.value)
            };
        };

        setGputempData(await fetchMetricData('gputemp', 'LocalPC'));
        setCpuUtilData(await fetchMetricData('cpuutilization', 'LocalPC'));
        setGpuUtilData(await fetchMetricData('gpuutilization', 'LocalPC'));
        setBtcPriceData(await fetchMetricData('btcprice', 'CryptoAPI'));
        setSolPriceData(await fetchMetricData('solprice', 'CryptoAPI'));
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [startDate, endDate]);

    return (
        <Paper elevation={3} style={{ padding: '30px', borderRadius: '15px', backgroundColor: '#121212', color: '#ffffff' }}>
            <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center', color: '#ffffff' }}>Visualise Metrics</Typography>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker label="Start Date" value={startDate} onChange={setStartDate} renderInput={(params) => <TextField {...params} style={{ backgroundColor: '#333', color: '#fff', borderRadius: '5px' }} />} />
                    <DatePicker label="End Date" value={endDate} onChange={setEndDate} renderInput={(params) => <TextField {...params} style={{ backgroundColor: '#333', color: '#fff', borderRadius: '5px' }} />} />
                </LocalizationProvider>
                <Button onClick={fetchData} variant="contained" style={{ height: '56px', backgroundColor: '#6200ea', color: '#fff' }}>Apply Filters</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '30px' }}>
                <TimeSeriesGraph deviceName="LocalPC" metricType="GPU Temperature" data={gputempData} loading={loading} />
                <TimeSeriesGraph deviceName="LocalPC" metricType="CPU Utilization" data={cpuUtilData} loading={loading} />
                <TimeSeriesGraph deviceName="LocalPC" metricType="GPU Utilization" data={gpuUtilData} loading={loading} />
                <TimeSeriesGraph deviceName="CryptoAPI" metricType="BTC Price" data={btcPriceData} loading={loading} />
                <TimeSeriesGraph deviceName="CryptoAPI" metricType="SOL Price" data={solPriceData} loading={loading} />
            </div>
        </Paper>
    );
};

export default Visualise;