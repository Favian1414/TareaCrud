import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, CssBaseline, Typography, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';
import Dashboard from './components/Dashboard';
import ClientesList from './components/ClientesList';
import PedidosList from './components/PedidosList';
import ProductosList from './components/ProductosList';
import { fetchClientes, fetchPedidos, fetchProductos } from './api';

export default function App() {
  const [tabValue, setTabValue] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchClientes(setClientes);
    fetchPedidos(setPedidos);
    fetchProductos(setProductos);
  }, []);

  const darkTheme = createTheme({ palette: { mode: 'dark' } });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

        <Box textAlign="center" mb={4}>
          <Typography variant="h3" gutterBottom>
            Sistema de Gestión de Clientes y Pedidos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra clientes, productos y pedidos de manera eficiente
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
          {tabValue === 0 && <Dashboard clientes={clientes} pedidos={pedidos} />}
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
