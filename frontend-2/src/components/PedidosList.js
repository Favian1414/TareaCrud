import React, { useState, useEffect } from 'react';
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
  Typography,
  Collapse,
  Grid,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import axios from 'axios';
import PedidoForm from './PedidoForm';
import ConfirmDialog from './ConfirmDialog';
import { agregarPedido, editarPedido, eliminarPedido } from '../api';

export default function PedidosList({ pedidos = [], setPedidos, clientes = [], productos = [] }) {
  const [editarData, setEditarData] = useState(null);
  const [dialog, setDialog] = useState({ open: false, data: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const [cargandoDetalles, setCargandoDetalles] = useState(null);

  // Debug: Ver qué datos están llegando
  useEffect(() => {
    console.log('📦 Pedidos en componente:', pedidos);
    console.log('👥 Clientes en componente:', clientes);
    console.log('🛍️ Productos en componente:', productos);
  }, [pedidos, clientes, productos]);

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-PE');
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    const precioNum = parseFloat(precio) || 0;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precioNum);
  };

  // Función para obtener color del estado
  const getColorEstado = (estado) => {
    switch (estado) {
      case 'entregado': return 'success';
      case 'enviado': return 'primary';
      case 'en_proceso': return 'warning';
      case 'confirmado': return 'info';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  // Función para cargar detalles de un pedido
  const cargarDetallesPedido = async (pedidoId) => {
    try {
      console.log('🔄 Cargando detalles para pedido:', pedidoId);
      const response = await axios.get(`http://localhost:5000/pedidos/${pedidoId}`);
      const detalles = response.data.detalles || [];
      console.log('✅ Detalles cargados:', detalles);
      return detalles;
    } catch (error) {
      console.error('❌ Error cargando detalles:', error);
      throw error;
    }
  };

  // Función para alternar la vista de detalles
  const toggleDetalles = async (pedidoId) => {
    if (pedidoExpandido === pedidoId) {
      // Si ya está expandido, colapsar
      setPedidoExpandido(null);
    } else {
      // Si no está expandido, cargar detalles y expandir
      setCargandoDetalles(pedidoId);
      
      try {
        const pedido = pedidos.find(p => p.id === pedidoId);
        
        // Solo cargar detalles si no los tiene o si queremos forzar recarga
        if (!pedido.detalles || pedido.detalles.length === 0) {
          const detalles = await cargarDetallesPedido(pedidoId);
          
          // Actualizar el pedido con los detalles cargados
          setPedidos(prev => prev.map(p => 
            p.id === pedidoId ? { ...p, detalles } : p
          ));
        }
        
        setPedidoExpandido(pedidoId);
      } catch (error) {
        console.error('Error al cargar detalles:', error);
        showSnackbar('Error al cargar detalles del pedido', 'error');
      } finally {
        setCargandoDetalles(null);
      }
    }
  };

  // Función para obtener el nombre completo del cliente
  const getNombreCliente = (clienteId) => {
    if (!clienteId) return 'Cliente no especificado';
    const cliente = clientes.find(c => c.id == clienteId); // Usar == para comparación flexible
    if (!cliente) {
      console.log('❌ Cliente no encontrado para ID:', clienteId);
      return 'Cliente no encontrado';
    }
    return `${cliente.nombre} ${cliente.apellido || ''}`.trim();
  };

  // Función para obtener código de pedido
  const getCodigoPedido = (pedido) => {
    return pedido.codigo_pedido || `PED-${pedido.id}`;
  };

  // Función para contar productos
  const getInfoProductos = (pedido) => {
    if (pedido.detalles && pedido.detalles.length > 0) {
      const totalItems = pedido.detalles.reduce((sum, detalle) => sum + (detalle.cantidad || 0), 0);
      return {
        totalProductos: pedido.detalles.length,
        totalItems: totalItems
      };
    }
    return {
      totalProductos: pedido.total_productos || 0,
      totalItems: pedido.total_items || 0
    };
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">

      {/* Formulario de pedido */}
      <PedidoForm
        initialData={editarData}
        clientes={clientes}
        productos={productos}
        onSubmit={async (data) => {
          try {
            console.log('📝 Enviando datos del pedido:', data);
            
            if (editarData) {
              // EDITAR PEDIDO
              await editarPedido(editarData.id, data, () => {
                setPedidos(prev => prev.map(pedido => 
                  pedido.id === editarData.id ? { ...pedido, ...data } : pedido
                ));
                setEditarData(null);
                showSnackbar('Pedido actualizado');
              });
            } else {
              // AGREGAR PEDIDO
              await agregarPedido(data, (nuevoPedido) => {
                console.log('✅ Nuevo pedido recibido:', nuevoPedido);
                setPedidos(prev => [...prev, nuevoPedido]);
                showSnackbar('Pedido agregado');
              });
            }
          } catch (error) {
            console.error('❌ Error:', error);
            showSnackbar('Error: ' + (error.message || 'Error desconocido'), 'error');
          }
        }}
      />

      {/* Tabla de pedidos */}
      <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: '#1e1e1e', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', width: '50px' }}></TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Código</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Productos</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ color: '#ccc', py: 3 }}>
                  No hay pedidos registrados
                </TableCell>
              </TableRow>
            ) : (
              pedidos.map(pedido => {
                const infoProductos = getInfoProductos(pedido);
                
                return (
                  <React.Fragment key={pedido.id}>
                    {/* Fila principal del pedido */}
                    <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                      
                      {/* Columna Expandir */}
                      <TableCell>
                        {cargandoDetalles === pedido.id ? (
                          <CircularProgress size={20} sx={{ color: '#D4AF37' }} />
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => toggleDetalles(pedido.id)}
                            sx={{ color: '#fff' }}
                          >
                            {pedidoExpandido === pedido.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        )}
                      </TableCell>

                      {/* Columna Código */}
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {getCodigoPedido(pedido)}
                      </TableCell>

                      {/* Columna Cliente */}
                      <TableCell sx={{ color: '#fff' }}>
                        {getNombreCliente(pedido.cliente_id)}
                      </TableCell>

                      {/* Columna Fecha */}
                      <TableCell sx={{ color: '#ccc' }}>
                        <Box>
                          <Typography variant="body2">
                            {formatearFecha(pedido.fecha_pedido)}
                          </Typography>
                          {pedido.fecha_entrega && (
                            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block' }}>
                              Entrega: {formatearFecha(pedido.fecha_entrega)}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      {/* Columna Estado */}
                      <TableCell>
                        <Chip 
                          label={pedido.estado?.replace('_', ' ') || 'pendiente'} 
                          size="small" 
                          color={getColorEstado(pedido.estado)}
                          variant="filled"
                        />
                      </TableCell>

                      {/* Columna Productos */}
                      <TableCell sx={{ color: '#ccc' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CartIcon sx={{ fontSize: 18 }} />
                          <Typography variant="body2">
                            {infoProductos.totalProductos} productos
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'grey.500' }}>
                            ({infoProductos.totalItems} items)
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Columna Total */}
                      <TableCell sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        {formatearPrecio(pedido.total)}
                      </TableCell>

                      {/* Columna Acciones */}
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box display="flex" justifyContent="center" gap={1}>
                          <Tooltip title="Ver detalles">
                            <IconButton 
                              size="small" 
                              onClick={() => toggleDetalles(pedido.id)}
                              sx={{ color: '#2196f3' }}
                              disabled={cargandoDetalles === pedido.id}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar pedido">
                            <IconButton 
                              size="small" 
                              onClick={() => setEditarData(pedido)}
                              sx={{ color: '#ff9800' }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar pedido">
                            <IconButton 
                              size="small" 
                              onClick={() => setDialog({ open: true, data: pedido })}
                              sx={{ color: '#f44336' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* Fila expandida con detalles */}
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 0, borderBottom: pedidoExpandido === pedido.id ? '1px solid rgba(255,255,255,0.1)' : 0 }}>
                        <Collapse in={pedidoExpandido === pedido.id} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            
                            {/* Información adicional del pedido */}
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                                  Información del Pedido
                                </Typography>
                                <Box sx={{ pl: 1 }}>
                                  <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
                                    <strong>Método de Pago:</strong> {pedido.metodo_pago || 'No especificado'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
                                    <strong>Subtotal:</strong> {formatearPrecio(pedido.subtotal)}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                                    <strong>Impuestos:</strong> {formatearPrecio(pedido.impuestos)}
                                  </Typography>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                                  Notas
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ccc', fontStyle: 'italic' }}>
                                  {pedido.notas || 'Sin notas adicionales'}
                                </Typography>
                              </Grid>
                            </Grid>

                            {/* Tabla de productos del pedido */}
                            {pedido.detalles && pedido.detalles.length > 0 ? (
                              <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(30,30,30,0.5)' }}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Producto</TableCell>
                                      <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Cantidad</TableCell>
                                      <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Precio Unit.</TableCell>
                                      <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Subtotal</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {pedido.detalles.map((detalle, index) => (
                                      <TableRow key={index}>
                                        <TableCell sx={{ color: '#fff' }}>
                                          <Box>
                                            <Typography variant="body2">
                                              {detalle.producto_nombre || `Producto ${detalle.producto_id}`}
                                            </Typography>
                                            {detalle.producto_descripcion && (
                                              <Typography variant="caption" sx={{ color: '#ccc', fontStyle: 'italic' }}>
                                                {detalle.producto_descripcion}
                                              </Typography>
                                            )}
                                          </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ccc' }}>
                                          {detalle.cantidad}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: '#ccc' }}>
                                          {formatearPrecio(detalle.precio_unitario)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                          {formatearPrecio(detalle.subtotal)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            ) : (
                              <Typography variant="body2" sx={{ color: 'grey.500', textAlign: 'center', py: 2 }}>
                                No hay detalles de productos disponibles
                              </Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            )}
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