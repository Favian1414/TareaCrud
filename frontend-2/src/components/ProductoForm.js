import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';

export default function ProductoForm({ onSubmit, initialData }) {
  const [producto, setProducto] = useState({ nombre: '', precio: 0 });

  useEffect(() => {
    if (initialData) setProducto(initialData);
  }, [initialData]);

  return (
    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
      <TextField
        label="Nombre"
        value={producto.nombre}
        onChange={e => setProducto({ ...producto, nombre: e.target.value })}
      />
      <TextField
        label="Precio"
        type="number"
        value={producto.precio}
        onChange={e => setProducto({ ...producto, precio: Number(e.target.value) })}
      />
      <Button variant="contained" onClick={() => onSubmit(producto)}>
        {initialData ? 'Guardar' : 'Agregar'}
      </Button>
    </Box>
  );
}
