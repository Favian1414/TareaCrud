import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert } from '@mui/material';
import ProductoForm from './ProductoForm';
import ConfirmDialog from './ConfirmDialog';
import { agregarProducto, editarProducto, eliminarProducto } from '../api';

export default function ProductosList({ productos = [], setProductos }) {
  const [editarData, setEditarData] = useState(null);
  const [dialog, setDialog] = useState({ open: false, data: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">

      {/* Formulario de producto */}
      <ProductoForm
        initialData={editarData}
        onSubmit={async (data) => {
          try {
            if (editarData) {
              // EDITAR PRODUCTO
              await editarProducto(editarData.id, data, () => {
                // CORRECTO: Actualizar el producto específico
                setProductos(prev => prev.map(producto => 
                  producto.id === editarData.id ? { ...producto, ...data } : producto
                ));
                setEditarData(null);
                showSnackbar('Producto actualizado');
              });
            } else {
              // AGREGAR PRODUCTO
              await agregarProducto(data, () => {
                // CORRECTO: Agregar con ID temporal
                const nuevoProducto = { ...data, id: Date.now() };
                setProductos(prev => [...prev, nuevoProducto]);
                showSnackbar('Producto agregado');
              });
            }
          } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error', 'error');
          }
        }}
      />

      {/* Tabla de productos */}
      <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: '#1e1e1e', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Nombre</TableCell>
              <TableCell sx={{ color: '#fff' }}>Precio</TableCell>
              <TableCell sx={{ color: '#fff', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map(p => (
              <TableRow key={p.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                <TableCell sx={{ color: '#fff' }}>{p.nombre}</TableCell>
                <TableCell sx={{ color: '#ccc' }}>${p.precio}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setEditarData(p)} 
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error" 
                    onClick={() => setDialog({ open: true, data: p })}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            await eliminarProducto(dialog.data.id, () => {
              // CORRECTO: Filtrar el producto eliminado
              setProductos(prev => prev.filter(p => p.id !== dialog.data.id));
              setDialog({ open: false, data: null });
              showSnackbar('Producto eliminado');
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