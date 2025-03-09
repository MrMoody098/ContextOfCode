import React, { useEffect, useState } from 'react';
import TimeSeriesGraph from './TimeSeriesGraph';
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
    const [stepSize, setStepSize] = useState(1); // Default step size
    const [timeInterval, setTimeInterval] = useState('hourly'); // Default time interval

    const fetchData = async () => {
        setLoading(true);

        // Function to fetch and format data for any metric type
        const fetchMetricData = async (metricType) => {
            let url = `http://localhost:8081/metrics/history/device/metric/LocalPC/${metricType}?stepSize=${stepSize}&timeInterval=${timeInterval}`;

            // Add date range if selected
            if (startDate && endDate) {
                url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            }

            const response = await fetch(url);
            const result = await response.json();

            // Process the data
            const labels = result.map(item => new Date(item.timestamp).toLocaleTimeString());  // Convert timestamp to a readable time string
            const values = result.map(item => item.value);  // Extract the 'value' from each metric entry

            return { labels, values };
        };

        // Fetch data for GPU Temperature, CPU Utilization, and GPU Utilization
        const gputemp = await fetchMetricData('gputemp');
        const cpuUtil = await fetchMetricData('cpuutilization');
        const gpuUtil = await fetchMetricData('gpuutilization');

        // Set the data state for each metric
        setGputempData(gputemp);
        setCpuUtilData(cpuUtil);
        setGpuUtilData(gpuUtil);

        setLoading(false);
    };

    useEffect(() => {
        fetchData(); // Fetch all the data when the component mounts or filters change
    }, [startDate, endDate, stepSize, timeInterval]);

    return (
        <div>
            <h2>Visualise</h2>

            {/* Filter Options */}
            <div style={{ marginBottom: 20 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </div>
                </LocalizationProvider>

                <div style={{ marginTop: 20 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="step-size-label">Step Size</InputLabel>
                        <Select
                            labelId="step-size-label"
                            id="step-size"
                            value={stepSize}
                            onChange={(e) => setStepSize(e.target.value)}
                        >
                            <MenuItem value={1}>1 Minute</MenuItem>
                            <MenuItem value={5}>5 Minutes</MenuItem>
                            <MenuItem value={10}>10 Minutes</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
                        <InputLabel id="time-interval-label">Time Interval</InputLabel>
                        <Select
                            labelId="time-interval-label"
                            id="time-interval"
                            value={timeInterval}
                            onChange={(e) => setTimeInterval(e.target.value)}
                        >
                            <MenuItem value="hourly">Hourly</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        onClick={fetchData}
                        variant="contained"
                        sx={{ marginLeft: 2 }}
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>

            {/* Time Series Graphs */}
            <TimeSeriesGraph
                deviceName="LocalPC"
                metricType="GPU Temperature"
                data={gputempData}
                loading={loading}
                stepSize={stepSize}
                timeInterval={timeInterval}
                startDate={startDate}
                endDate={endDate}
            />
            <TimeSeriesGraph
                deviceName="LocalPC"
                metricType="CPU Utilization"
                data={cpuUtilData}
                loading={loading}
                stepSize={stepSize}
                timeInterval={timeInterval}
                startDate={startDate}
                endDate={endDate}
            />
            <TimeSeriesGraph
                deviceName="LocalPC"
                metricType="GPU Utilization"
                data={gpuUtilData}
                loading={loading}
                stepSize={stepSize}
                timeInterval={timeInterval}
                startDate={startDate}
                endDate={endDate}
            />
        </div>
    );
};

export default Visualise;
