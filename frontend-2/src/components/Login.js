import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Dashboard as DashboardIcon,
  HowToReg as HowToRegIcon
} from '@mui/icons-material';
import { loginUser } from '../api';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginUser(credentials);
      
      if (result.success) {
        onLogin(true, result.user);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(result.user));
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo/Título */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <DashboardIcon 
            sx={{ 
              fontSize: 60, 
              mb: 2,
              backgroundColor: 'primary.main',
              padding: 1,
              borderRadius: 2,
              boxShadow: 3
            }} 
          />
          <Typography 
            component="h1" 
            variant="h3" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Sistema de Gestión
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Iniciar Sesión
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            Ingresa tus credenciales para acceder al sistema
          </Typography>
        </Box>

        {/* Card del formulario */}
        <Paper 
          elevation={8}
          sx={{
            width: '100%',
            padding: 4,
            background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)'
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                alignItems: 'center'
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={credentials.username}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                mb: 3,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                  boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .4)',
                },
                '&:disabled': {
                  background: 'grey.600',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Ingresar al Sistema'
              )}
            </Button>

            

            {/* Botón para cambiar a registro */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ¿No tienes una cuenta?
              </Typography>
              <Button
                variant="outlined"
                startIcon={<HowToRegIcon />}
                onClick={onSwitchToRegister}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Crear Cuenta
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Sistema de Gestión de Clientes y Pedidos v1.0
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Desarrollado con React & Node.js
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}