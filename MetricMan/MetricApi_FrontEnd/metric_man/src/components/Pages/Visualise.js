import React, { useEffect, useState } from 'react';
import TimeSeriesGraph from '../TimeSeriesGraph';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Visualise = () => {
    const [gputempData, setGputempData] = useState({ labels: [], values: [] });
    const [cpuUtilData, setCpuUtilData] = useState({ labels: [], values: [] });
    const [gpuUtilData, setGpuUtilData] = useState({ labels: [], values: [] });
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        const fetchMetricData = async (metricType) => {
            let url = `http://localhost:8081/metrics/history/device/metric/LocalPC/${metricType}`;
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

        setGputempData(await fetchMetricData('gputemp'));
        setCpuUtilData(await fetchMetricData('cpuutilization'));
        setGpuUtilData(await fetchMetricData('gpuutilization'));
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Visualise</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker label="Start Date" value={startDate} onChange={setStartDate} renderInput={(params) => <TextField {...params} />} />
                    <DatePicker label="End Date" value={endDate} onChange={setEndDate} renderInput={(params) => <TextField {...params} />} />
                </LocalizationProvider>
                <Button onClick={fetchData} variant="contained">Apply Filters</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <TimeSeriesGraph deviceName="LocalPC" metricType="GPU Temperature" data={gputempData} loading={loading} />
                <TimeSeriesGraph deviceName="LocalPC" metricType="CPU Utilization" data={cpuUtilData} loading={loading} />
                <TimeSeriesGraph deviceName="LocalPC" metricType="GPU Utilization" data={gpuUtilData} loading={loading} />
            </div>
        </div>
    );
};

export default Visualise;