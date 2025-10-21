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

  // Colores del tema
  const themeColors = {
    primary: '#D4AF37', // Dorado principal
    primaryDark: '#B8941F', // Dorado oscuro
    primaryLight: '#E8C55A', // Dorado claro
    background: '#121212', // Fondo negro
    surface: '#1E1E1E', // Superficie
    textPrimary: '#FFFFFF', // Texto principal
    textSecondary: '#B0B0B0', // Texto secundario
    border: '#333333', // Bordes
    success: '#4CAF50', // Verde para estados positivos
    warning: '#FF9800', // Naranja para advertencias
  };

  return (
    <Box sx={{ 
      p: 1, 
      backgroundColor: themeColors.background,
      minHeight: '100vh',
      color: themeColors.textPrimary
    }}>
      {/* HEADER PRINCIPAL */}
      <Box sx={{ textAlign: 'center', mb: 4, pt: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: themeColors.primary }}>
          PANEL DE CONTROL
        </Typography>
        <Typography variant="subtitle1" sx={{ color: themeColors.textSecondary }}>
          Resumen general del sistema
        </Typography>
      </Box>

      {/* MÉTRICAS PRINCIPALES */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${themeColors.surface} 0%, #2A2A2A 100%)`,
            color: themeColors.textPrimary,
            height: 120,
            border: `1px solid ${themeColors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 20px rgba(212, 175, 55, 0.2)`,
            }
          }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: themeColors.primary }}>
                {totalClientes}
              </Typography>
              <Typography variant="h6" sx={{ color: themeColors.textSecondary }}>
                CLIENTES
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${themeColors.surface} 0%, #2A2A2A 100%)`,
            color: themeColors.textPrimary,
            height: 120,
            border: `1px solid ${themeColors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 20px rgba(212, 175, 55, 0.2)`,
            }
          }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: themeColors.primary }}>
                {totalPedidos}
              </Typography>
              <Typography variant="h6" sx={{ color: themeColors.textSecondary }}>
                PEDIDOS
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${themeColors.surface} 0%, #2A2A2A 100%)`,
            color: themeColors.textPrimary,
            height: 120,
            border: `1px solid ${themeColors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 20px rgba(212, 175, 55, 0.2)`,
            }
          }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: themeColors.primary }}>
                {totalProductos}
              </Typography>
              <Typography variant="h6" sx={{ color: themeColors.textSecondary }}>
                PRODUCTOS
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${themeColors.surface} 0%, #2A2A2A 100%)`,
            color: themeColors.textPrimary,
            height: 120,
            border: `1px solid ${themeColors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 20px rgba(212, 175, 55, 0.2)`,
            }
          }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: themeColors.primary }}>
                {promedioPedidosPorCliente}
              </Typography>
              <Typography variant="h6" sx={{ color: themeColors.textSecondary }}>
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
          <Paper sx={{ 
            p: 3, 
            height: '100%', 
            backgroundColor: themeColors.surface,
            border: `1px solid ${themeColors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: themeColors.textPrimary }}>
                DISTRIBUCIÓN DE PEDIDOS
              </Typography>
              <Chip 
                label={`${porcentajeClientesActivos}% CLIENTES ACTIVOS`} 
                sx={{ 
                  backgroundColor: themeColors.primary, 
                  color: themeColors.background,
                  fontWeight: 'bold'
                }}
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
                    stroke={themeColors.textSecondary}
                  />
                  <YAxis allowDecimals={false} stroke={themeColors.textSecondary} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: themeColors.surface,
                      border: `1px solid ${themeColors.border}`,
                      color: themeColors.textPrimary
                    }}
                  />
                  <Bar 
                    dataKey="pedidos" 
                    fill={themeColors.primary}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: themeColors.textSecondary }} gutterBottom>
                  📊 Sin datos de pedidos
                </Typography>
                <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                  No hay pedidos registrados para mostrar el gráfico
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* COLUMNA DERECHA - ESTADÍSTICAS */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ 
            p: 3, 
            height: '100%', 
            backgroundColor: themeColors.surface,
            border: `1px solid ${themeColors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: themeColors.textPrimary }}>
              ESTADO DEL SISTEMA
            </Typography>
            
            {/* Indicador de estado */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3, 
              p: 2, 
              borderRadius: 2,
              bgcolor: sistemaActivo ? themeColors.success : themeColors.warning,
              color: 'white'
            }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: sistemaActivo ? themeColors.success : themeColors.warning,
                mr: 2,
                animation: sistemaActivo ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                }
              }} />
              <Typography variant="h6" fontWeight="bold">
                {sistemaActivo ? 'SISTEMA ACTIVO' : 'SISTEMA INACTIVO'}
              </Typography>
            </Box>

            {/* Métricas rápidas */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: '#2A2A2A', 
                    borderRadius: 2,
                    border: `1px solid ${themeColors.border}`
                  }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: themeColors.primary }}>
                      {clientesConPedidos}
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                      Clientes Activos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: '#2A2A2A', 
                    borderRadius: 2,
                    border: `1px solid ${themeColors.border}`
                  }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: themeColors.primary }}>
                      {productosTop.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                      Productos Vendidos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Resumen */}
            <Box sx={{ 
              bgcolor: '#2A2A2A', 
              p: 2, 
              borderRadius: 2,
              border: `1px solid ${themeColors.border}`
            }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: themeColors.primary }}>
                RESUMEN EJECUTIVO
              </Typography>
              <Box sx={{ lineHeight: 2 }}>
                <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                  • {clientesConPedidos} de {totalClientes} clientes activos
                </Typography>
                <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                  • {productosTop.length} de {totalProductos} productos con ventas
                </Typography>
                <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
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
          <Paper sx={{ 
            p: 3, 
            backgroundColor: themeColors.surface,
            border: `1px solid ${themeColors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: themeColors.textPrimary }}>
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
                        bgcolor: index === 0 ? themeColors.primary : 
                                 index === 1 ? '#C0C0C0' : 
                                 index === 2 ? '#CD7F32' : '#2A2A2A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontSize: '12px',
                        color: index < 3 ? themeColors.background : themeColors.primary,
                        fontWeight: 'bold',
                        border: index >= 3 ? `1px solid ${themeColors.primary}` : 'none'
                      }}>
                        {index + 1}
                      </Box>
                      <ListItemText 
                        primary={
                          <Typography sx={{ color: themeColors.textPrimary }}>
                            {producto.nombre}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ color: themeColors.textSecondary }}>
                            {producto.ventas} ventas • {producto.cantidadTotal} unidades
                          </Typography>
                        }
                      />
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small"
                        sx={{ 
                          backgroundColor: index < 3 ? themeColors.primary : 'transparent',
                          color: index < 3 ? themeColors.background : themeColors.primary,
                          border: index >= 3 ? `1px solid ${themeColors.primary}` : 'none'
                        }}
                      />
                    </ListItem>
                    {index < productosTop.length - 1 && (
                      <Divider sx={{ backgroundColor: themeColors.border }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: themeColors.textSecondary }} gutterBottom>
                  📦 Sin productos vendidos
                </Typography>
                <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                  No hay ventas registradas aún
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* CLIENTES DESTACADOS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: themeColors.surface,
            border: `1px solid ${themeColors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: themeColors.textPrimary }}>
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
                        bgcolor: '#2A2A2A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontSize: '12px',
                        color: themeColors.primary,
                        fontWeight: 'bold',
                        border: `1px solid ${themeColors.primary}`
                      }}>
                        {index + 1}
                      </Box>
                      <ListItemText 
                        primary={
                          <Typography sx={{ color: themeColors.textPrimary }}>
                            {cliente.nombre}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ color: themeColors.textSecondary }}>
                            {cliente.pedidos} pedido{cliente.pedidos !== 1 ? 's' : ''}
                          </Typography>
                        }
                      />
                      <Chip 
                        label={`${cliente.pedidos} pedidos`} 
                        size="small"
                        sx={{ 
                          backgroundColor: 'transparent',
                          color: themeColors.primary,
                          border: `1px solid ${themeColors.primary}`
                        }}
                      />
                    </ListItem>
                    {index < Math.min(4, pedidosPorCliente.length - 1) && (
                      <Divider sx={{ backgroundColor: themeColors.border }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: themeColors.textSecondary }} gutterBottom>
                  👥 Sin clientes activos
                </Typography>
                <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
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