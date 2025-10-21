import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert } from '@mui/material';
import ClienteForm from './ClienteForm';
import ConfirmDialog from './ConfirmDialog';
import { agregarCliente, editarCliente, eliminarCliente } from '../api';

export default function ClientesList({ clientes = [], setClientes }) {
  const [editarData, setEditarData] = useState(null);
  const [dialog, setDialog] = useState({ open: false, data: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">

      {/* Formulario arriba */}
      <ClienteForm
        initialData={editarData}
        onSubmit={async (data) => {
          try {
            if (editarData) {
              // EDITAR CLIENTE
              await editarCliente(editarData.id, data, () => {
                // CORRECTO: Actualizar el estado correctamente
                setClientes(prev => prev.map(cliente => 
                  cliente.id === editarData.id ? { ...cliente, ...data } : cliente
                ));
                setEditarData(null);
                showSnackbar('Cliente actualizado');
              });
            } else {
              // AGREGAR CLIENTE
              await agregarCliente(data, () => {
                // CORRECTO: Agregar con ID temporal hasta que se confirme del servidor
                const nuevoCliente = { ...data, id: Date.now() }; // ID temporal
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
      <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: '#1e1e1e' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Nombre</TableCell>
              <TableCell sx={{ color: '#fff' }}>Email</TableCell>
              <TableCell sx={{ color: '#fff' }}>Teléfono</TableCell>
              <TableCell sx={{ color: '#fff' }}>Dirección</TableCell>
              <TableCell sx={{ color: '#fff', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map(c => (
              <TableRow key={c.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                <TableCell sx={{ color: '#fff' }}>{c.nombre}</TableCell>
                <TableCell sx={{ color: '#ccc' }}>{c.email}</TableCell>
                <TableCell sx={{ color: '#ccc' }}>{c.telefono}</TableCell>
                <TableCell sx={{ color: '#ccc' }}>{c.direccion}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button size="small" variant="outlined" onClick={() => setEditarData(c)} sx={{ mr: 1 }}>Editar</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => setDialog({ open: true, data: c })}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Notificaciones */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={dialog.open}
        type="cliente"
        onClose={() => setDialog({ open: false, data: null })}
        onConfirm={async () => {
          try {
            await eliminarCliente(dialog.data.id, () => {
              // CORRECTO: Filtrar el cliente eliminado
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