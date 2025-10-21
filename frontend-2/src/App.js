import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, CssBaseline, Typography, Box, Button, AppBar, Toolbar, Chip } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';
import Dashboard from './components/Dashboard';
import ClientesList from './components/ClientesList';
import PedidosList from './components/PedidosList';
import ProductosList from './components/ProductosList';
import Login from './components/Login';
import Register from './components/Register'; // ← Importa el nuevo componente
import { fetchClientes, fetchPedidos, fetchProductos } from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showRegister, setShowRegister] = useState(false); // ← Nuevo estado

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      
      // Cargar datos
      fetchClientes(setClientes);
      fetchPedidos(setPedidos);
      fetchProductos(setProductos);
    }
  }, []);

  const handleLogin = (status, userData = null) => {
    setIsAuthenticated(status);
    setUser(userData);
    if (status) {
      // Cargar datos después del login
      fetchClientes(setClientes);
      fetchPedidos(setPedidos);
      fetchProductos(setProductos);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    // Limpiar datos
    setClientes([]);
    setPedidos([]);
    setProductos([]);
  };

  const darkTheme = createTheme({ palette: { mode: 'dark' } });

  // Si no está autenticado, mostrar login o registro
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {showRegister ? (
          <Register 
            onRegister={handleLogin}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login 
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </ThemeProvider>
    );
  }

  // Si está autenticado, mostrar la aplicación principal
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      {/* Barra de navegación con usuario */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${user?.nombre} (${user?.rol})`} 
              color="secondary" 
              variant="outlined"
            />
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" gutterBottom>
            Sistema de Gestión de Clientes y Pedidos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Bienvenido, {user?.nombre}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" mb={4}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
            <Tab label="Dashboard" />
            <Tab label="Clientes" />
            <Tab label="Productos" />
            <Tab label="Pedidos" />
          </Tabs>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
          {tabValue === 0 && <Dashboard clientes={clientes} pedidos={pedidos} productos={productos} />}
          {tabValue === 1 && <ClientesList clientes={clientes} setClientes={setClientes} />}
          {tabValue === 2 && <ProductosList productos={productos} setProductos={setProductos} />}
          {tabValue === 3 && (
            <PedidosList
              clientes={clientes}
              productos={productos}
              pedidos={pedidos}
              setPedidos={setPedidos}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}