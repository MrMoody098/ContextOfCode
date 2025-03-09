import React, { useState, useEffect } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination } from '@mui/material';

const AllMetrics = () => {
    const [metrics, setMetrics] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('timestamp');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch(`http://localhost:8081/metrics/search?page=${page}&size=${rowsPerPage}&sortBy=${orderBy}&sortDir=${order}`);
                const data = await response.json();
                setMetrics(data.content);
                setTotalElements(data.totalElements);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        };

        fetchMetrics();
    }, [order, orderBy, page, rowsPerPage]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredMetrics = metrics.filter(metric =>
        metric.metric && metric.metric.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filter === '' || metric.metric === filter)
    );

    return (
        <div>
            <TextField
                label="Search Metric"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', marginRight: '20px' }}
            />
            <TextField
                label="Filter by Device"
                variant="outlined"
                value={filter}
                onChange={handleFilterChange}
                style={{ marginBottom: '20px' }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'device'}
                                    direction={orderBy === 'device' ? order : 'asc'}
                                    onClick={() => handleRequestSort('device')}
                                >
                                    Device
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'metric'}
                                    direction={orderBy === 'metric' ? order : 'asc'}
                                    onClick={() => handleRequestSort('metric')}
                                >
                                    Metric
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'value'}
                                    direction={orderBy === 'value' ? order : 'asc'}
                                    onClick={() => handleRequestSort('value')}
                                >
                                    Value
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'timestamp'}
                                    direction={orderBy === 'timestamp' ? order : 'asc'}
                                    onClick={() => handleRequestSort('timestamp')}
                                >
                                    Timestamp
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'unit'}
                                    direction={orderBy === 'unit' ? order : 'asc'}
                                    onClick={() => handleRequestSort('unit')}
                                >
                                    Unit
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMetrics.map((metric) => (
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
        </div>
    );
};

export default AllMetrics;
