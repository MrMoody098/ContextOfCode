import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import CPUMetrics from './components/CPUMetrics';
import NavBar from './components/NavBar';
import AllMetrics from './components/AllMetrics';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/latest" element={<CPUMetrics />} />
                    <Route path="/all" element={<AllMetrics />} />
                    <Route path="/visualize" element={<div>Visualize Component</div>} />
                    <Route path="/" element={<CPUMetrics />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;