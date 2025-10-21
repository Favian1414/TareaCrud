import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';

export default function ClienteForm({ onSubmit, initialData }) {
  const [cliente, setCliente] = useState({ nombre: '', email: '', telefono: '', direccion: '' });

  useEffect(() => { if (initialData) setCliente(initialData); }, [initialData]);

  return (
    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
      <TextField label="Nombre" value={cliente.nombre} onChange={e => setCliente({ ...cliente, nombre: e.target.value })} />
      <TextField label="Email" value={cliente.email} onChange={e => setCliente({ ...cliente, email: e.target.value })} />
      <TextField label="Teléfono" value={cliente.telefono} onChange={e => setCliente({ ...cliente, telefono: e.target.value })} />
      <TextField label="Dirección" value={cliente.direccion} onChange={e => setCliente({ ...cliente, direccion: e.target.value })} />
      <Button variant="contained" onClick={() => onSubmit(cliente)}>{initialData ? 'Guardar' : 'Agregar'}</Button>
    </Box>
  );
}
