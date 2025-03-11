import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Latest from './components/Pages/Latest';
import NavBar from './components/NavBar';
import AllMetrics from './components/Pages/AllMetrics';
import Visualise from "./components/Pages/Visualise";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/latest" element={<Latest />} />
                    <Route path="/all" element={<AllMetrics />} />
                    <Route path="/visualize" element={<Visualise/>} />
                    <Route path="/" element={<Latest />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;