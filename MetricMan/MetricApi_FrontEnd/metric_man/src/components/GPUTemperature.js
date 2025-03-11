import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Chip, Tooltip, Box } from '@mui/material';
import { DeviceThermostat } from '@mui/icons-material'; // Correct thermometer icon

const getTemperatureStatus = (temp) => {
    if (temp >= 100) {
        return { status: 'Critical', color: 'red', tooltip: 'Severe overheating! GPU may shut down to prevent damage.' };
    } else if (temp >= 90) {
        return { status: 'Dangerous', color: 'darkorange', tooltip: 'Risk of thermal throttling and crashes.' };
    } else if (temp >= 85) {
        return { status: 'High', color: 'orange', tooltip: 'May indicate cooling issues, but still within range.' };
    } else if (temp >= 80) {
        return { status: 'High Load', color: 'yellow', tooltip: 'Normal for gaming or heavy workloads.' };
    } else if (temp >= 60) {
        return { status: 'Normal Load', color: 'lightgreen', tooltip: 'Normal for gaming or workloads like rendering.' };
    } else if (temp >= 30) {
        return { status: 'Idle', color: 'lightblue', tooltip: 'Normal range when idle or performing light tasks.' };
    } else {
        return { status: 'Low', color: 'lightgray', tooltip: 'Below normal operating range.' };
    }
};

const GPUTemperature = ({ temp }) => {
    const [status, setStatus] = useState({});

    useEffect(() => {
        setStatus(getTemperatureStatus(temp));
    }, [temp]);

    return (
        <Card sx={{ width: '100%', maxWidth: 300, backgroundColor: '#2e2e2e', color: 'white', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <DeviceThermostat sx={{ marginRight: 1 }} fontSize="small" />
                    GPU Temperature
                </Typography>
                <Tooltip title={status.tooltip} placement="top">
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                        <Chip
                            label={`${temp}°C`}
                            sx={{
                                backgroundColor: status.color,
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.4rem',
                                padding: '8px 16px',
                            }}
                        />
                    </Box>
                </Tooltip>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                    Status: {status.status}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default GPUTemperature;
