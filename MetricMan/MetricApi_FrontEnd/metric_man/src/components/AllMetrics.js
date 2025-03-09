import React, { useState, useEffect } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AllMetrics = () => {
    const [metrics, setMetrics] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('timestamp');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const params = new URLSearchParams({
                    page,
                    size: rowsPerPage,
                    sortBy: orderBy,
                    sortDir: order,
                    device: filter,
                    metric: searchTerm
                });

                if (startDate) params.append('startDate', new Date(startDate).toISOString());
                if (endDate) params.append('endDate', new Date(endDate).toISOString());

                const response = await fetch(`http://localhost:8081/metrics/search?${params.toString()}`);
                const data = await response.json();
                setMetrics(data.content);
                setTotalElements(data.totalElements);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        };

        fetchMetrics();
    }, [order, orderBy, page, rowsPerPage, searchTerm, filter, startDate, endDate]);

    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const handleFilterChange = (event) => setFilter(event.target.value);
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <TextField label="Search Metric" variant="outlined" value={searchTerm} onChange={handleSearchChange} style={{ marginRight: '20px' }} />
                <TextField label="Filter by Device" variant="outlined" value={filter} onChange={handleFilterChange} style={{ marginRight: '20px' }} />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} style={{ marginRight: '20px' }} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </div>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['device', 'metric', 'value', 'timestamp', 'unit'].map((col) => (
                                <TableCell key={col}>
                                    <TableSortLabel active={orderBy === col} direction={orderBy === col ? order : 'asc'} onClick={() => handleRequestSort(col)}>
                                        {col.charAt(0).toUpperCase() + col.slice(1)}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {metrics.map((metric) => (
                            <TableRow key={metric.id}>
                                <TableCell>{metric.device}</TableCell>
                                <TableCell>{metric.metric}</TableCell>
                                <TableCell>{metric.value}</TableCell>
                                <TableCell>{metric.timestamp}</TableCell>
                                <TableCell>{metric.unit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default AllMetrics;
