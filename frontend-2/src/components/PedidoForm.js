import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';

export default function PedidoForm({ onSubmit, initialData, clientes = [], productos = [] }) {
  const [pedido, setPedido] = useState({
    cliente_id: '',
    fecha_pedido: new Date().toISOString().split('T')[0],
    fecha_entrega: '',
    estado: 'pendiente',
    metodo_pago: '',
    notas: ''
  });

  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    producto_id: '',
    cantidad: 1,
    precio_unitario: 0
  });

  useEffect(() => {
    if (initialData) {
      setPedido({
        cliente_id: initialData.cliente_id || '',
        fecha_pedido: initialData.fecha_pedido || new Date().toISOString().split('T')[0],
        fecha_entrega: initialData.fecha_entrega || '',
        estado: initialData.estado || 'pendiente',
        metodo_pago: initialData.metodo_pago || '',
        notas: initialData.notas || ''
      });
      
      if (initialData.detalles) {
        setProductosSeleccionados(initialData.detalles);
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const datosEnviar = {
      ...pedido,
      productos: productosSeleccionados
    };

    onSubmit(datosEnviar);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value
    }));

    // Cuando se selecciona un producto, cargar su precio automáticamente
    if (name === 'producto_id' && value) {
      const producto = productos.find(p => p.id == value);
      if (producto) {
        setNuevoProducto(prev => ({
          ...prev,
          precio_unitario: producto.precio
        }));
      }
    }
  };

  const agregarProducto = () => {
  if (nuevoProducto.producto_id && nuevoProducto.cantidad > 0) {
    const producto = productos.find(p => p.id == nuevoProducto.producto_id);
    
    // Asegurarnos de que producto_id sea un número
    const productoParaEnviar = {
      producto_id: parseInt(nuevoProducto.producto_id), // Convertir a número
      cantidad: parseInt(nuevoProducto.cantidad),
      precio_unitario: parseFloat(nuevoProducto.precio_unitario)
    };
    
    setProductosSeleccionados(prev => [
      ...prev,
      {
        ...productoParaEnviar,
        producto_nombre: producto?.nombre,
        subtotal: productoParaEnviar.cantidad * productoParaEnviar.precio_unitario
      }
    ]);
    
    // Resetear el formulario de producto
    setNuevoProducto({
      producto_id: '',
      cantidad: 1,
      precio_unitario: 0
    });
  }
};

  const eliminarProducto = (index) => {
    setProductosSeleccionados(prev => prev.filter((_, i) => i !== index));
  };

  // Calcular totales
  const subtotal = productosSeleccionados.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0);
  const impuestos = subtotal * 0.18;
  const total = subtotal + impuestos;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
      <Grid container spacing={3}>
        
        {/* Información del Pedido */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Información del Pedido
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Cliente</InputLabel>
            <Select
              name="cliente_id"
              value={pedido.cliente_id}
              label="Cliente"
              onChange={handleChange}
              required
            >
              <MenuItem value="">Seleccionar Cliente</MenuItem>
              {clientes.map(cliente => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nombre} {cliente.apellido} - {cliente.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Fecha de Pedido"
            name="fecha_pedido"
            type="date"
            value={pedido.fecha_pedido}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Fecha de Entrega"
            name="fecha_entrega"
            type="date"
            value={pedido.fecha_entrega}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado"
              value={pedido.estado}
              label="Estado"
              onChange={handleChange}
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="confirmado">Confirmado</MenuItem>
              <MenuItem value="en_proceso">En Proceso</MenuItem>
              <MenuItem value="enviado">Enviado</MenuItem>
              <MenuItem value="entregado">Entregado</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Método de Pago</InputLabel>
            <Select
              name="metodo_pago"
              value={pedido.metodo_pago}
              label="Método de Pago"
              onChange={handleChange}
            >
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="tarjeta">Tarjeta</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Notas"
            name="notas"
            value={pedido.notas}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        {/* Agregar Productos */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Productos del Pedido
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Producto</InputLabel>
            <Select
              name="producto_id"
              value={nuevoProducto.producto_id}
              label="Producto"
              onChange={handleProductoChange}
            >
              <MenuItem value="">Seleccionar Producto</MenuItem>
              {productos.map(producto => (
                <MenuItem key={producto.id} value={producto.id}>
                  {producto.nombre} - S/ {producto.precio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Cantidad"
            name="cantidad"
            type="number"
            value={nuevoProducto.cantidad}
            onChange={handleProductoChange}
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Precio Unitario"
            name="precio_unitario"
            type="number"
            value={nuevoProducto.precio_unitario}
            onChange={handleProductoChange}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={agregarProducto}
            disabled={!nuevoProducto.producto_id}
            sx={{ height: '56px' }}
          >
            Agregar
          </Button>
        </Grid>

        {/* Lista de Productos Agregados */}
        {productosSeleccionados.length > 0 && (
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="right">Precio Unitario</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosSeleccionados.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.producto_nombre || `Producto ${item.producto_id}`}
                      </TableCell>
                      <TableCell align="center">{item.cantidad}</TableCell>
                      <TableCell align="right">S/ {item.precio_unitario}</TableCell>
                      <TableCell align="right">
                        S/ {(item.cantidad * item.precio_unitario).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="error" 
                          onClick={() => eliminarProducto(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Totales */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body1">Subtotal:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body1">S/ {subtotal.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Impuestos (18%):</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body1">S/ {impuestos.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" fontWeight="bold">Total:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="h6" fontWeight="bold">
                    S/ {total.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}

        {/* Botón de Envío */}
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large"
            startIcon={<CartIcon />}
            disabled={productosSeleccionados.length === 0}
          >
            {initialData ? 'Actualizar Pedido' : 'Crear Pedido'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}