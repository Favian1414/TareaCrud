import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, CssBaseline, Typography, Box, Button, AppBar, Toolbar, Chip } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';
import Dashboard from './components/Dashboard';
import ClientesList from './components/ClientesList';
import PedidosList from './components/PedidosList';
import ProductosList from './components/ProductosList';
import Login from './components/Login';
import Register from './components/Register';
import { fetchClientes, fetchPedidos, fetchProductos } from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showRegister, setShowRegister] = useState(false);

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

  // Tema personalizado dorado y negro
  const elegantTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#D4AF37', // Dorado principal
        light: '#E8C55A',
        dark: '#B8941F',
      },
      secondary: {
        main: '#121212', // Negro
        light: '#1E1E1E',
        dark: '#0A0A0A',
      },
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
            borderBottom: '1px solid #333333',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontWeight: 'bold',
            fontSize: '1rem',
            '&.Mui-selected': {
              color: '#D4AF37',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#D4AF37',
            height: 3,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: 8,
            '&:hover': {
              transform: 'translateY(-1px)',
              transition: 'transform 0.2s',
            },
          },
          outlined: {
            borderColor: '#D4AF37',
            color: '#D4AF37',
            '&:hover': {
              borderColor: '#E8C55A',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 'bold',
          },
          outlined: {
            borderColor: '#D4AF37',
            color: '#D4AF37',
          },
        },
      },
    },
  });

  // Si no está autenticado, mostrar login o registro
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={elegantTheme}>
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
    <ThemeProvider theme={elegantTheme}>
      <CssBaseline />
      
      {/* Barra de navegación elegante */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ py: 2 }}>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #D4AF37, #E8C55A)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            SISTEMA DE GESTIÓN
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${user?.nombre} • ${user?.rol}`} 
              variant="outlined"
              sx={{
                fontWeight: 'bold',
                borderColor: '#D4AF37',
                color: '#D4AF37',
              }}
            />
            <Button 
              variant="outlined" 
              onClick={handleLogout}
              sx={{
                borderColor: '#D4AF37',
                color: '#D4AF37',
                '&:hover': {
                  borderColor: '#E8C55A',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                },
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header principal */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #D4AF37, #E8C55A)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2
            }}
          >
            Panel de Control
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              letterSpacing: '0.1em'
            }}
          >
            Bienvenido, {user?.nombre}
          </Typography>
        </Box>

        {/* Navegación con pestañas elegantes */}
        <Box 
          display="flex" 
          justifyContent="center" 
          mb={6}
          sx={{
            background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
            borderRadius: 3,
            p: 1,
            border: '1px solid #333333',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#D4AF37',
                height: 3,
                borderRadius: 2
              }
            }}
          >
            <Tab 
              label="Dashboard" 
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: tabValue === 0 ? '#D4AF37' : 'text.secondary',
                mx: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                }
              }}
            />
            <Tab 
              label="Clientes" 
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: tabValue === 1 ? '#D4AF37' : 'text.secondary',
                mx: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                }
              }}
            />
            <Tab 
              label="Productos" 
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: tabValue === 2 ? '#D4AF37' : 'text.secondary',
                mx: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                }
              }}
            />
            <Tab 
              label="Pedidos" 
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: tabValue === 3 ? '#D4AF37' : 'text.secondary',
                mx: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                }
              }}
            />
          </Tabs>
        </Box>

        {/* Contenido principal */}
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

        {/* Footer elegante */}
        <Box 
          textAlign="center" 
          mt={8} 
          mb={4}
          sx={{
            borderTop: '1px solid #333333',
            pt: 3
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              letterSpacing: '0.1em'
            }}
          >
            SISTEMA DE GESTIÓN • {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}