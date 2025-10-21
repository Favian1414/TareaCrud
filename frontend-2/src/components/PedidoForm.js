import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function PedidoForm({ onSubmit, initialData, clientes, productos }) {
  const [pedido, setPedido] = useState({ 
    cliente_id: '', 
    producto_id: '', 
    cantidad: 1 
  });

  useEffect(() => {
    if (initialData) {
      setPedido({
        cliente_id: initialData.cliente_id || '',
        producto_id: initialData.producto_id || '',
        cantidad: initialData.cantidad || 1
      });
    }
  }, [initialData]);

  // VERIFICACIONES MÁS ESTRICTAS
  const listaClientes = clientes && Array.isArray(clientes) ? clientes : [];
  const listaProductos = productos && Array.isArray(productos) ? productos : [];

  const handleSubmit = () => {
    if (!pedido.cliente_id || !pedido.producto_id || !pedido.cantidad) {
      alert('Por favor, complete todos los campos');
      return;
    }
    
    if (pedido.cantidad < 1) {
      alert('La cantidad debe ser al menos 1');
      return;
    }
    
    onSubmit(pedido);
    
    if (!initialData) {
      setPedido({ cliente_id: '', producto_id: '', cantidad: 1 });
    }
  };

  return (
    <Box display="flex" gap={1} mb={2} flexWrap="wrap" alignItems="center">
      {/* Selector de Cliente - CON MÁS VERIFICACIONES */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Cliente</InputLabel>
        <Select
          value={pedido.cliente_id}
          onChange={e => setPedido({ ...pedido, cliente_id: e.target.value })}
          label="Cliente"
        >
          <MenuItem value="">Seleccionar Cliente</MenuItem>
          {/* Verificación adicional antes del map */}
          {listaClientes && listaClientes.length > 0 ? (
            listaClientes.map(c => (
              <MenuItem key={c?.id || Math.random()} value={c?.id}>
                {c?.nombre || 'Cliente sin nombre'}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay clientes disponibles</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Selector de Producto - CON MÁS VERIFICACIONES */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Producto</InputLabel>
        <Select
          value={pedido.producto_id}
          onChange={e => setPedido({ ...pedido, producto_id: e.target.value })}
          label="Producto"
        >
          <MenuItem value="">Seleccionar Producto</MenuItem>
          {/* Verificación adicional antes del map */}
          {listaProductos && listaProductos.length > 0 ? (
            listaProductos.map(p => (
              <MenuItem key={p?.id || Math.random()} value={p?.id}>
                {p?.nombre || 'Producto sin nombre'}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay productos disponibles</MenuItem>
          )}
        </Select>
      </FormControl>

      <TextField
        label="Cantidad"
        type="number"
        value={pedido.cantidad}
        onChange={e => setPedido({ ...pedido, cantidad: parseInt(e.target.value) || 1 })}
        inputProps={{ min: 1 }}
        sx={{ width: 120 }}
      />

      <Button 
        variant="contained" 
        onClick={handleSubmit}
        disabled={!pedido.cliente_id || !pedido.producto_id || !pedido.cantidad}
      >
        {initialData ? 'Guardar Cambios' : 'Agregar Pedido'}
      </Button>
    </Box>
  );
}

// Props por defecto para mayor seguridad
PedidoForm.defaultProps = {
  clientes: [],
  productos: [],
  onSubmit: () => console.warn('No se proporcionó función onSubmit'),
  initialData: null
};