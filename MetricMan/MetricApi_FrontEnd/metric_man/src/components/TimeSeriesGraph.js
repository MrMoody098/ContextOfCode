import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TimeSeriesGraph = ({ deviceName, metricType, data, loading }) => {
    return (
        <Card sx={{ minWidth: 275, backgroundColor: '#2e2e2e', color: 'white', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <CardContent>
                <Typography variant="h6">{deviceName} - {metricType} Time Series</Typography>

                {loading ? (
                    <CircularProgress color="primary" />
                ) : (
                    <Line
                        data={{
                            labels: data.labels,
                            datasets: [
                                {
                                    label: `${deviceName} ${metricType}`,
                                    data: data.values,
                                    borderColor: 'rgba(75, 192, 192, 1)', // Customize border color
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Customize background color
                                    tension: 0.1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: metricType,
                                    },
                                    min: 0,
                                },
                            },
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default TimeSeriesGraph;
