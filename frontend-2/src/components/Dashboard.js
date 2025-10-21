import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export default function Dashboard({ clientes = [], pedidos = [], productos = [] }) {
  // Métricas principales
  const totalClientes = clientes.length;
  const totalPedidos = pedidos.length;
  const totalProductos = productos.length;

  // Cálculos
  const pedidosPorCliente = clientes.map(c => ({
    nombre: c.nombre,
    pedidos: pedidos.filter(p => p.cliente_id === c.id).length
  })).filter(item => item.pedidos > 0)
    .sort((a, b) => b.pedidos - a.pedidos);

  const clientesConPedidos = pedidosPorCliente.length;
  const promedioPedidosPorCliente = totalClientes > 0 ? (totalPedidos / totalClientes).toFixed(1) : '0.0';
  const porcentajeClientesActivos = totalClientes > 0 ? ((clientesConPedidos / totalClientes) * 100).toFixed(0) : '0';

  // Productos más vendidos
  const productosTop = productos.map(p => ({
    nombre: p.nombre,
    ventas: pedidos.filter(ped => ped.producto_id === p.id).length,
    cantidadTotal: pedidos.filter(ped => ped.producto_id === p.id)
      .reduce((sum, ped) => sum + (parseInt(ped.cantidad) || 0), 0)
  }))
  .filter(p => p.ventas > 0)
  .sort((a, b) => b.ventas - a.ventas)
  .slice(0, 5);

  const sistemaActivo = totalPedidos > 0;

  return (
    <Box sx={{ p: 1 }}>
      {/* HEADER PRINCIPAL */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          PANEL DE CONTROL
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Resumen general del sistema
        </Typography>
      </Box>

      {/* MÉTRICAS PRINCIPALES */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            height: 120
          }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight="bold">
                {totalClientes}
              </Typography>
              <Typography variant="h6">
                CLIENTES
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
            color: 'white',
            height: 120
          }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight="bold">
                {totalPedidos}
              </Typography>
              <Typography variant="h6">
                PEDIDOS
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)',
            color: 'white',
            height: 120
          }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight="bold">
                {totalProductos}
              </Typography>
              <Typography variant="h6">
                PRODUCTOS
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
            color: 'white',
            height: 120
          }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight="bold">
                {promedioPedidosPorCliente}
              </Typography>
              <Typography variant="h6">
                PROMEDIO
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CONTENIDO PRINCIPAL */}
      <Grid container spacing={3}>
        {/* COLUMNA IZQUIERDA - GRÁFICO */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">
                DISTRIBUCIÓN DE PEDIDOS
              </Typography>
              <Chip 
                label={`${porcentajeClientesActivos}% CLIENTES ACTIVOS`} 
                color="primary" 
                variant="filled"
              />
            </Box>
            
            {pedidosPorCliente.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pedidosPorCliente.slice(0, 8)}>
                  <XAxis 
                    dataKey="nombre" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar 
                    dataKey="pedidos" 
                    fill="#1976d2" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  📊 Sin datos de pedidos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No hay pedidos registrados para mostrar el gráfico
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* COLUMNA DERECHA - ESTADÍSTICAS */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              ESTADO DEL SISTEMA
            </Typography>
            
            {/* Indicador de estado */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3, 
              p: 2, 
              borderRadius: 2,
              bgcolor: sistemaActivo ? 'success.main' : 'grey.500',
              color: 'white'
            }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: sistemaActivo ? '#4caf50' : '#9e9e9e',
                mr: 2,
                animation: sistemaActivo ? 'pulse 1.5s infinite' : 'none'
              }} />
              <Typography variant="h6" fontWeight="bold">
                {sistemaActivo ? 'SISTEMA ACTIVO' : 'SISTEMA INACTIVO'}
              </Typography>
            </Box>

            {/* Métricas rápidas */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {clientesConPedidos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clientes Activos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {productosTop.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Productos Vendidos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Resumen */}
            <Box sx={{ bgcolor: 'primary.50', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                RESUMEN EJECUTIVO
              </Typography>
              <Box sx={{ lineHeight: 2 }}>
                <Typography variant="body2">
                  • {clientesConPedidos} de {totalClientes} clientes activos
                </Typography>
                <Typography variant="body2">
                  • {productosTop.length} de {totalProductos} productos con ventas
                </Typography>
                <Typography variant="body2">
                  • Tasa de actividad: {porcentajeClientesActivos}%
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* SECCIÓN INFERIOR - PRODUCTOS Y CLIENTES */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* PRODUCTOS POPULARES */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🏆 PRODUCTOS DESTACADOS
            </Typography>
            
            {productosTop.length > 0 ? (
              <List>
                {productosTop.map((producto, index) => (
                  <React.Fragment key={producto.nombre}>
                    <ListItem>
                      <Box sx={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        bgcolor: index === 0 ? '#FFD700' : 
                                 index === 1 ? '#C0C0C0' : 
                                 index === 2 ? '#CD7F32' : 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontSize: '12px',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </Box>
                      <ListItemText 
                        primary={producto.nombre}
                        secondary={`${producto.ventas} ventas • ${producto.cantidadTotal} unidades`}
                      />
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small"
                        color={index < 3 ? "primary" : "default"}
                      />
                    </ListItem>
                    {index < productosTop.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  📦 Sin productos vendidos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No hay ventas registradas aún
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* CLIENTES DESTACADOS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              ⭐ CLIENTES DESTACADOS
            </Typography>
            
            {pedidosPorCliente.length > 0 ? (
              <List>
                {pedidosPorCliente.slice(0, 5).map((cliente, index) => (
                  <React.Fragment key={cliente.nombre}>
                    <ListItem>
                      <Box sx={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontSize: '12px',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </Box>
                      <ListItemText 
                        primary={cliente.nombre}
                        secondary={`${cliente.pedidos} pedido${cliente.pedidos !== 1 ? 's' : ''}`}
                      />
                      <Chip 
                        label={`${cliente.pedidos} pedidos`} 
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </ListItem>
                    {index < Math.min(4, pedidosPorCliente.length - 1) && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  👥 Sin clientes activos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No hay pedidos registrados
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}