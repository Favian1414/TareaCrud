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
  Warning as WarningIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import ProductoForm from './ProductoForm';
import ConfirmDialog from './ConfirmDialog';
import { agregarProducto, editarProducto, eliminarProducto } from '../api';

export default function ProductosList({ productos = [], setProductos }) {
  const [editarData, setEditarData] = useState(null);
  const [dialog, setDialog] = useState({ open: false, data: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const tieneStockBajo = (producto) => {
    return producto.stock <= producto.stock_minimo;
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">

      {/* Formulario de producto */}
      <ProductoForm
        initialData={editarData}
        onSubmit={async (data) => {
          try {
            if (editarData) {
              // EDITAR PRODUCTO - CORREGIDO
              await editarProducto(editarData.id, data, (error, updatedData) => {
                if (error) {
                  showSnackbar('Error al actualizar producto', 'error');
                  return;
                }
                // Actualizar estado local con datos reales del backend
                setProductos(prev => prev.map(producto => 
                  producto.id === editarData.id ? { ...producto, ...updatedData } : producto
                ));
                setEditarData(null);
                showSnackbar('Producto actualizado correctamente');
              });
            } else {
              // AGREGAR PRODUCTO - CORREGIDO
              await agregarProducto(data, (error, newProduct) => {
                if (error) {
                  showSnackbar('Error al agregar producto', 'error');
                  return;
                }
                // Agregar producto real del backend (con ID correcto)
                setProductos(prev => [...prev, newProduct]);
                showSnackbar('Producto agregado correctamente');
              });
            }
          } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error de conexión', 'error');
          }
        }}
      />

      {/* Tabla de productos */}
      <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: '#1e1e1e', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Imagen</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>SKU</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Categoría</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Proveedor</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map(p => (
              <TableRow 
                key={p.id} 
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.05)' },
                  borderLeft: tieneStockBajo(p) ? '4px solid #ff6b6b' : 'none'
                }}
              >
                {/* Columna Imagen */}
                <TableCell>
                  {p.imagen ? (
                    <Tooltip title="Ver imagen">
                      <IconButton 
                        size="small"
                        onClick={() => window.open(p.imagen, '_blank')}
                        sx={{ color: '#2196f3' }}
                      >
                        <ImageIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Sin imagen">
                      <ImageIcon sx={{ color: 'grey.500', fontSize: 20 }} />
                    </Tooltip>
                  )}
                </TableCell>

                {/* Columna Nombre y Descripción */}
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {p.nombre}
                    </Typography>
                    {p.descripcion && (
                      <Typography variant="caption" sx={{ color: '#ccc', fontStyle: 'italic' }}>
                        {p.descripcion.length > 50 
                          ? `${p.descripcion.substring(0, 50)}...` 
                          : p.descripcion
                        }
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                {/* Columna SKU */}
                <TableCell sx={{ color: '#ccc' }}>
                  {p.sku || (
                    <Typography variant="caption" sx={{ color: 'grey.500', fontStyle: 'italic' }}>
                      Sin SKU
                    </Typography>
                  )}
                </TableCell>

                {/* Columna Categoría */}
                <TableCell>
                  {p.categoria ? (
                    <Chip 
                      label={p.categoria} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="caption" sx={{ color: 'grey.500', fontStyle: 'italic' }}>
                      Sin categoría
                    </Typography>
                  )}
                </TableCell>

                {/* Columna Precio */}
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {formatearPrecio(p.precio)}
                    </Typography>
                    {p.precio_original && p.precio_original > p.precio && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'grey.500', 
                          textDecoration: 'line-through',
                          display: 'block'
                        }}
                      >
                        {formatearPrecio(p.precio_original)}
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                {/* Columna Stock */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: tieneStockBajo(p) ? '#ff6b6b' : '#4caf50',
                        fontWeight: tieneStockBajo(p) ? 'bold' : 'normal'
                      }}
                    >
                      {p.stock || 0}
                    </Typography>
                    {tieneStockBajo(p) && (
                      <Tooltip title="Stock bajo">
                        <WarningIcon sx={{ color: '#ff6b6b', fontSize: 18 }} />
                      </Tooltip>
                    )}
                    <Typography variant="caption" sx={{ color: 'grey.500' }}>
                      / {p.stock_minimo || 5} min
                    </Typography>
                  </Box>
                </TableCell>

                {/* Columna Proveedor */}
                <TableCell sx={{ color: '#ccc' }}>
                  {p.proveedor || (
                    <Typography variant="caption" sx={{ color: 'grey.500', fontStyle: 'italic' }}>
                      No especificado
                    </Typography>
                  )}
                </TableCell>

                {/* Columna Estado */}
                <TableCell>
                  <Chip 
                    label={p.activo ? 'Activo' : 'Inactivo'} 
                    size="small" 
                    color={p.activo ? 'success' : 'default'}
                    variant={p.activo ? 'filled' : 'outlined'}
                  />
                </TableCell>

                {/* Columna Acciones */}
                <TableCell sx={{ textAlign: 'center' }}>
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="Editar producto">
                      <IconButton 
                        size="small" 
                        onClick={() => setEditarData(p)}
                        sx={{ color: '#2196f3' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar producto">
                      <IconButton 
                        size="small" 
                        onClick={() => setDialog({ open: true, data: p })}
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

      {/* Mensaje si no hay productos */}
      {productos.length === 0 && (
        <Box sx={{ mt: 3, textAlign: 'center', p: 3 }}>
          <Typography variant="h6" sx={{ color: 'grey.500' }}>
            No hay productos registrados
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500', mt: 1 }}>
            Agrega tu primer producto usando el formulario de arriba
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
        type="producto"
        onClose={() => setDialog({ open: false, data: null })}
        onConfirm={async () => {
          try {
            await eliminarProducto(dialog.data.id, (error) => {
              if (error) {
                showSnackbar('Error al eliminar producto', 'error');
                return;
              }
              setProductos(prev => prev.filter(p => p.id !== dialog.data.id));
              setDialog({ open: false, data: null });
              showSnackbar('Producto eliminado correctamente');
            });
          } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error de conexión', 'error');
          }
        }}
      />
    </Box>
  );
}