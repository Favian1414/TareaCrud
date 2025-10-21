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
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  HowToReg as RegisterIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { registerUser } from '../api';

export default function Register({ onRegister, onSwitchToLogin }) {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    email: '',
    rol: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones del frontend
    if (userData.password !== userData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (userData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Eliminar confirmPassword antes de enviar
      const { confirmPassword, ...dataToSend } = userData;
      
      const result = await registerUser(dataToSend);
      
      if (result.success) {
        setSuccess('Usuario registrado exitosamente');
        setUserData({
          username: '',
          password: '',
          confirmPassword: '',
          nombre: '',
          email: '',
          rol: 'user'
        });
        // Opcional: auto-login después del registro
        // onRegister(true, result.user);
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
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
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
          <RegisterIcon 
            sx={{ 
              fontSize: 60, 
              mb: 2,
              backgroundColor: 'secondary.main',
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
              background: 'linear-gradient(45deg, #FF4081 30%, #F50057 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Crear Cuenta
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Registra un nuevo usuario
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

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                alignItems: 'center'
              }}
            >
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Nombre Completo */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="nombre"
              label="Nombre Completo"
              name="nombre"
              autoComplete="name"
              value={userData.nombre}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" />
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
              }}
            />

            {/* Email */}
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Username */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              name="username"
              autoComplete="username"
              value={userData.username}
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
                },
              }}
            />

            {/* Rol */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                id="rol"
                name="rol"
                value={userData.rol}
                label="Rol"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="user">Usuario</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>

            {/* Contraseña */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              value={userData.password}
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
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Confirmar Contraseña */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              value={userData.confirmPassword}
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
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #FF4081 30%, #F50057 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 64, 129, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #F50057 30%, #C51162 90%)',
                  boxShadow: '0 4px 8px 2px rgba(255, 64, 129, .4)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Registrar Usuario'
              )}
            </Button>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ¿Ya tienes una cuenta?
              </Typography>
              <Button
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={onSwitchToLogin}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Iniciar Sesión
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}