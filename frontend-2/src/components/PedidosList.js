import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert } from '@mui/material';
import PedidoForm from './PedidoForm';
import ConfirmDialog from './ConfirmDialog';
import { agregarPedido, editarPedido, eliminarPedido } from '../api';

export default function PedidosList({ pedidos = [], setPedidos, clientes = [], productos = [] }) {
  const [editarData, setEditarData] = useState(null);
  const [dialog, setDialog] = useState({ open: false, data: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">

      {/* Formulario de pedido */}
      <PedidoForm
        initialData={editarData}
        clientes={clientes}
        productos={productos}
        onSubmit={async (data) => {
          try {
            if (editarData) {
              // EDITAR PEDIDO
              await editarPedido(editarData.id, data, () => {
                // CORRECTO: Actualizar el pedido específico
                setPedidos(prev => prev.map(pedido => 
                  pedido.id === editarData.id ? { ...pedido, ...data } : pedido
                ));
                setEditarData(null);
                showSnackbar('Pedido actualizado');
              });
            } else {
              // AGREGAR PEDIDO
              await agregarPedido(data, () => {
                // CORRECTO: Agregar con ID temporal
                const nuevoPedido = { ...data, id: Date.now() };
                setPedidos(prev => [...prev, nuevoPedido]);
                showSnackbar('Pedido agregado');
              });
            }
          } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error', 'error');
          }
        }}
      />

      {/* Tabla de pedidos */}
      <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: '#1e1e1e', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Cliente</TableCell>
              <TableCell sx={{ color: '#fff' }}>Producto</TableCell>
              <TableCell sx={{ color: '#fff' }}>Cantidad</TableCell>
              <TableCell sx={{ color: '#fff', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map(p => (
              <TableRow key={p.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                <TableCell sx={{ color: '#fff' }}>
                  {clientes.find(c => c.id === p.cliente_id)?.nombre || 'Cliente no encontrado'}
                </TableCell>
                <TableCell sx={{ color: '#ccc' }}>
                  {productos.find(prod => prod.id === p.producto_id)?.nombre || 'Producto no encontrado'}
                </TableCell>
                <TableCell sx={{ color: '#ccc' }}>{p.cantidad}</TableCell>
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
        type="pedido"
        onClose={() => setDialog({ open: false, data: null })}
        onConfirm={async () => {
          try {
            await eliminarPedido(dialog.data.id, () => {
              // CORRECTO: Filtrar el pedido eliminado
              setPedidos(prev => prev.filter(p => p.id !== dialog.data.id));
              setDialog({ open: false, data: null });
              showSnackbar('Pedido eliminado');
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