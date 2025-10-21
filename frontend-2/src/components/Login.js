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
  HowToReg as HowToRegIcon,
  EmojiPeople as WelcomeIcon
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

  // Colores del tema amigable
  const themeColors = {
    primary: '#D4AF37', // Dorado principal
    primaryLight: '#E8C55A', // Dorado claro
    primaryDark: '#B8941F', // Dorado oscuro
    background: '#121212', // Fondo negro
    surface: '#1E1E1E', // Superficie
    surfaceLight: '#2A2A2A', // Superficie clara
    textPrimary: '#FFFFFF', // Texto principal
    textSecondary: '#B0B0B0', // Texto secundario
    border: '#333333', // Bordes
    success: '#4CAF50', // Verde para éxito
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        
        py: 4
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
        {/* Header Acogedor */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DashboardIcon 
                sx={{ 
                  fontSize: 50,
                  color: themeColors.primary,
                }} 
              />
              <WelcomeIcon 
                sx={{ 
                  fontSize: 24,
                  color: themeColors.primaryLight,
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  backgroundColor: themeColors.surface,
                  borderRadius: '50%',
                  padding: 0.5
                }} 
              />
            </Box>
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{
                fontWeight: 'bold',
                color: themeColors.primary,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              ¡Bienvenido!
            </Typography>
          </Box>
          
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: themeColors.textPrimary,
              mb: 1
            }}
          >
            Sistema de Gestión
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: themeColors.textSecondary,
              maxWidth: 400,
              lineHeight: 1.6
            }}
          >
            Ingresa a tu cuenta para gestionar clientes, productos y pedidos de manera sencilla
          </Typography>
        </Box>

        {/* Card del formulario - Más amigable */}
        <Paper 
          elevation={0}
          sx={{
            width: '100%',
            padding: 4,
            background: themeColors.surface,
            border: `2px solid ${themeColors.border}`,
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              borderColor: themeColors.primary,
              transition: 'border-color 0.3s ease'
            }
          }}
        >
          {/* Mensaje de bienvenida */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: themeColors.primary,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <PersonIcon /> Inicia Sesión
            </Typography>
            <Typography variant="body2" sx={{ color: themeColors.textSecondary, mt: 1 }}>
              Tu portal de gestión empresarial
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                color: themeColors.textPrimary,
                border: `1px solid #f44336`,
                '& .MuiAlert-icon': {
                  color: '#f44336'
                }
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
              label="Nombre de usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={credentials.username}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ingresa tu usuario"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: themeColors.primary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  color: themeColors.textPrimary,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: themeColors.border,
                    borderWidth: 2,
                  },
                  '&:hover fieldset': {
                    borderColor: themeColors.primaryLight,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: themeColors.primary,
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: themeColors.textSecondary,
                  '&.Mui-focused': {
                    color: themeColors.primary,
                  },
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
              placeholder="Ingresa tu contraseña"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: themeColors.primary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  color: themeColors.textPrimary,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: themeColors.border,
                    borderWidth: 2,
                  },
                  '&:hover fieldset': {
                    borderColor: themeColors.primaryLight,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: themeColors.primary,
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: themeColors.textSecondary,
                  '&.Mui-focused': {
                    color: themeColors.primary,
                  },
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryLight} 100%)`,
                color: themeColors.background,
                boxShadow: `0 4px 15px ${themeColors.primary}40`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
                  boxShadow: `0 6px 20px ${themeColors.primary}60`,
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&:disabled': {
                  background: themeColors.border,
                  color: themeColors.textSecondary,
                  boxShadow: 'none',
                  transform: 'none',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: themeColors.background }} />
              ) : (
                <>
                  <LockIcon sx={{ mr: 1, fontSize: 20 }} />
                  Ingresar a Mi Cuenta
                </>
              )}
            </Button>

            {/* Separador amigable */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>
              <Divider sx={{ flex: 1, borderColor: themeColors.border }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: themeColors.textSecondary, 
                  px: 2,
                  fontStyle: 'italic'
                }}
              >
                ¿Primera vez aquí?
              </Typography>
              <Divider sx={{ flex: 1, borderColor: themeColors.border }} />
            </Box>

            {/* Botón para registro */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: themeColors.textSecondary, 
                  mb: 2,
                  fontWeight: '500'
                }}
              >
                ¿Aún no tienes cuenta?
              </Typography>
              <Button
                variant="outlined"
                startIcon={<HowToRegIcon />}
                onClick={onSwitchToRegister}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderColor: themeColors.primary,
                  color: themeColors.primary,
                  px: 4,
                  py: 1,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: themeColors.primaryLight,
                    color: themeColors.primaryLight,
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${themeColors.primary}30`,
                    borderWidth: 2,
                  }
                }}
              >
                Crear Mi Cuenta
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Footer amigable */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: themeColors.textSecondary, mb: 1 }}>
            💼 Sistema de Gestión Empresarial v2.0
          </Typography>
          <Typography variant="caption" sx={{ color: themeColors.textSecondary, opacity: 0.7 }}>
            Diseñado para hacer tu trabajo más fácil y eficiente
          </Typography>
        </Box>

        {/* Características destacadas */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3, 
            mt: 4,
            flexWrap: 'wrap'
          }}
        >
          {[
            { icon: '👥', text: 'Gestiona Clientes' },
            { icon: '📦', text: 'Controla Productos' },
            { icon: '📋', text: 'Organiza Pedidos' }
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                maxWidth: 100
              }}
            >
              <Typography variant="h4" sx={{ mb: 1 }}>
                {item.icon}
              </Typography>
              <Typography variant="caption" sx={{ color: themeColors.textSecondary }}>
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}