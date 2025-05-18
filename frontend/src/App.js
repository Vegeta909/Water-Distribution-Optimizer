import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import MaxFlow from './pages/MaxFlow';
import MinimumSpanningTree from './pages/MinimumSpanningTree';
import ShortestPath from './pages/ShortestPath';
import Footer from './components/Footer';

// Create a theme with water-inspired colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // water blue
      light: '#bbdefb',
      dark: '#0d47a1',
    },
    secondary: {
      main: '#4caf50', // green for eco-friendly
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          boxShadow: '0 4px 6px rgba(33, 150, 243, 0.25)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flexGrow: 1, padding: '20px', paddingBottom: '60px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/max-flow" element={<MaxFlow />} />
              <Route path="/minimum-spanning-tree" element={<MinimumSpanningTree />} />
              <Route path="/shortest-path" element={<ShortestPath />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
