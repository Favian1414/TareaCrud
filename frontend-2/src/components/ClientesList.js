import React, { useState } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Snackbar, 
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import ClienteForm from './ClienteForm';
import ConfirmDialog from './ConfirmDialog';
import { agregarCliente, editarCliente, eliminarCliente } from '../api';

export default function ClientesList({ clientes = [], setClientes }) {
  const [editarData, setEditarData] = useState(null);
  const [dialog, setDialog] = useState({ open: false, data: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-PE');
  };

  // Función para calcular edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Función para obtener color de categoría
  const getColorCategoria = (categoria) => {
    switch (categoria) {
      case 'premium': return 'warning';
      case 'frecuente': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">

      {/* Formulario de cliente */}
      <ClienteForm
        initialData={editarData}
        onSubmit={async (data) => {
          try {
            if (editarData) {
              // EDITAR CLIENTE
              await editarCliente(editarData.id, data, () => {
                setClientes(prev => prev.map(cliente => 
                  cliente.id === editarData.id ? { ...cliente, ...data } : cliente
                ));
                setEditarData(null);
                showSnackbar('Cliente actualizado');
              });
            } else {
              // AGREGAR CLIENTE
              await agregarCliente(data, () => {
                const nuevoCliente = { ...data, id: Date.now() };
                setClientes(prev => [...prev, nuevoCliente]);
                showSnackbar('Cliente agregado');
              });
            }
          } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error', 'error');
          }
        }}
      />

      {/* Tabla de clientes */}
      <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: '#1e1e1e', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Información</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Contacto</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Ubicación</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>DNI/RUC</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Categoría</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Puntos</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map(c => (
              <TableRow key={c.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                
                {/* Columna Tipo */}
                <TableCell>
                  <Tooltip title={c.tipo === 'empresa' ? 'Empresa' : 'Persona'}>
                    {c.tipo === 'empresa' ? (
                      <BusinessIcon sx={{ color: '#ff9800' }} />
                    ) : (
                      <PersonIcon sx={{ color: '#2196f3' }} />
                    )}
                  </Tooltip>
                </TableCell>

                {/* Columna Información */}
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {c.nombre} {c.apellido || ''}
                    </Typography>
                    {c.fecha_nacimiento && (
                      <Typography variant="caption" sx={{ color: '#ccc', display: 'block' }}>
                        {formatearFecha(c.fecha_nacimiento)} 
                        {calcularEdad(c.fecha_nacimiento) && (
                          <span> ({calcularEdad(c.fecha_nacimiento)} años)</span>
                        )}
                      </Typography>
                    )}
                    {c.genero && (
                      <Typography variant="caption" sx={{ color: '#ccc', display: 'block' }}>
                        {c.genero.charAt(0).toUpperCase() + c.genero.slice(1)}
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                {/* Columna Contacto */}
                <TableCell>
                  <Box>
                    {c.email && (
                      <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
                        <EmailIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: '#ccc' }}>
                          {c.email}
                        </Typography>
                      </Box>
                    )}
                    {c.telefono && (
                      <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
                        <PhoneIcon sx={{ color: '#2196f3', fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: '#ccc' }}>
                          {c.telefono}
                        </Typography>
                      </Box>
                    )}
                    {c.celular && (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <PhoneIcon sx={{ color: '#ff9800', fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: '#ccc' }}>
                          {c.celular}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>

                {/* Columna Ubicación */}
                <TableCell>
                  <Box>
                    {c.direccion && (
                      <Box display="flex" alignItems="flex-start" gap={0.5} sx={{ mb: 0.5 }}>
                        <LocationIcon sx={{ color: '#f44336', fontSize: 16, mt: 0.2 }} />
                        <Typography variant="caption" sx={{ color: '#ccc' }}>
                          {c.direccion.length > 30 
                            ? `${c.direccion.substring(0, 30)}...` 
                            : c.direccion
                          }
                        </Typography>
                      </Box>
                    )}
                    {(c.ciudad || c.departamento) && (
                      <Typography variant="caption" sx={{ color: '#ccc', display: 'block' }}>
                        {[c.ciudad, c.departamento].filter(Boolean).join(', ')}
                      </Typography>
                    )}
                    {c.codigo_postal && (
                      <Typography variant="caption" sx={{ color: '#ccc', display: 'block' }}>
                        CP: {c.codigo_postal}
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                {/* Columna DNI/RUC */}
                <TableCell sx={{ color: '#ccc' }}>
                  {c.dni_ruc || (
                    <Typography variant="caption" sx={{ color: 'grey.500', fontStyle: 'italic' }}>
                      No especificado
                    </Typography>
                  )}
                </TableCell>

                {/* Columna Categoría */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip 
                      label={c.categoria || 'normal'} 
                      size="small" 
                      color={getColorCategoria(c.categoria)}
                      variant="outlined"
                    />
                    {c.categoria === 'premium' && (
                      <StarIcon sx={{ color: '#ffd700', fontSize: 16 }} />
                    )}
                  </Box>
                </TableCell>

                {/* Columna Puntos */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: c.puntos > 100 ? '#ffd700' : '#ccc',
                        fontWeight: c.puntos > 100 ? 'bold' : 'normal'
                      }}
                    >
                      {c.puntos || 0}
                    </Typography>
                    {c.puntos > 100 && (
                      <StarIcon sx={{ color: '#ffd700', fontSize: 16 }} />
                    )}
                  </Box>
                </TableCell>

                {/* Columna Estado */}
                <TableCell>
                  <Chip 
                    label={c.activo ? 'Activo' : 'Inactivo'} 
                    size="small" 
                    color={c.activo ? 'success' : 'default'}
                    variant={c.activo ? 'filled' : 'outlined'}
                  />
                </TableCell>

                {/* Columna Acciones */}
                <TableCell sx={{ textAlign: 'center' }}>
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="Editar cliente">
                      <IconButton 
                        size="small" 
                        onClick={() => setEditarData(c)}
                        sx={{ color: '#2196f3' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar cliente">
                      <IconButton 
                        size="small" 
                        onClick={() => setDialog({ open: true, data: c })}
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mensaje si no hay clientes */}
      {clientes.length === 0 && (
        <Box sx={{ mt: 3, textAlign: 'center', p: 3 }}>
          <Typography variant="h6" sx={{ color: 'grey.500' }}>
            No hay clientes registrados
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500', mt: 1 }}>
            Agrega tu primer cliente usando el formulario de arriba
          </Typography>
        </Box>
      )}

      {/* Notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={dialog.open}
        type="cliente"
        onClose={() => setDialog({ open: false, data: null })}
        onConfirm={async () => {
          try {
            await eliminarCliente(dialog.data.id, () => {
              setClientes(prev => prev.filter(c => c.id !== dialog.data.id));
              setDialog({ open: false, data: null });
              showSnackbar('Cliente eliminado');
            });
          } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error al eliminar', 'error');
          }
        }}
      />
    </Box>
  );
}