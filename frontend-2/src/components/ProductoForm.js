import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel, Grid } from '@mui/material';

export default function ProductoForm({ onSubmit, initialData }) {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precio_original: '',
    categoria: '',
    stock: 0,
    stock_minimo: 5,
    sku: `PROD-${Date.now()}`,
    imagen: '',
    proveedor: '',
    activo: true
});

  useEffect(() => {
    if (initialData) {
      setProducto({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        precio: initialData.precio || '',
        precio_original: initialData.precio_original || initialData.precio || '',
        categoria: initialData.categoria || '',
        stock: initialData.stock || 0,
        stock_minimo: initialData.stock_minimo || 5,
        sku: initialData.sku || '',
        imagen: initialData.imagen || '',
        proveedor: initialData.proveedor || '',
        activo: initialData.activo !== undefined ? initialData.activo : true
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convertir números
    const datosEnviar = {
      ...producto,
      precio: parseFloat(producto.precio) || 0,
      precio_original: parseFloat(producto.precio_original) || parseFloat(producto.precio) || 0,
      stock: parseInt(producto.stock) || 0,
      stock_minimo: parseInt(producto.stock_minimo) || 5
    };

    onSubmit(datosEnviar);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: name === 'activo' ? checked : value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* Fila 1 */}
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Nombre del Producto"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="SKU (Código único)"
            name="sku"
            value={producto.sku}
            onChange={handleChange}
          />
        </Grid>

        {/* Fila 2 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descripción"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
          />
        </Grid>

        {/* Fila 3 */}
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            type="number"
            label="Precio"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Precio Original"
            name="precio_original"
            value={producto.precio_original}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Categoría"
            name="categoria"
            value={producto.categoria}
            onChange={handleChange}
          />
        </Grid>

        {/* Fila 4 */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Stock Actual"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Stock Mínimo"
            name="stock_minimo"
            value={producto.stock_minimo}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Proveedor"
            name="proveedor"
            value={producto.proveedor}
            onChange={handleChange}
          />
        </Grid>

        {/* Fila 5 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL de Imagen"
            name="imagen"
            value={producto.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </Grid>

        {/* Fila 6 */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={producto.activo}
                onChange={handleChange}
                name="activo"
                color="primary"
              />
            }
            label="Producto Activo"
          />
        </Grid>

        {/* Botón */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth size="large">
            {initialData ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}