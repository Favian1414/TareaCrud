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
  Divider
} from '@mui/material';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  People as PeopleIcon,
  ShoppingCart as PedidosIcon,
  Inventory as ProductosIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon
} from '@mui/icons-material';

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard({ clientes = [], pedidos = [], productos = [] }) {
  // Métricas básicas
  const totalClientes = clientes.length;
  const totalPedidos = pedidos.length;
  const totalProductos = productos.length;

  // Pedidos por cliente
  const pedidosPorCliente = clientes.map(c => ({
    nombre: c.nombre,
    pedidos: pedidos.filter(p => p.cliente_id === c.id).length
  })).filter(item => item.pedidos > 0);

  // Productos más pedidos
  const productosMasPedidos = productos.map(p => ({
    nombre: p.nombre,
    cantidad: pedidos.filter(ped => ped.producto_id === p.id)
      .reduce((sum, ped) => sum + (parseInt(ped.cantidad) || 0), 0)
  }))
  .filter(item => item.cantidad > 0)
  .sort((a, b) => b.cantidad - a.cantidad)
  .slice(0, 5);

  // Clientes más activos
  const clientesTop = [...pedidosPorCliente]
    .sort((a, b) => b.pedidos - a.pedidos)
    .slice(0, 5);

  // Tendencias mensuales (simulado)
  const tendenciaMensual = [
    { mes: 'Ene', pedidos: Math.floor(Math.random() * 20) + 10 },
    { mes: 'Feb', pedidos: Math.floor(Math.random() * 20) + 15 },
    { mes: 'Mar', pedidos: Math.floor(Math.random() * 20) + 12 },
    { mes: 'Abr', pedidos: Math.floor(Math.random() * 20) + 18 },
    { mes: 'May', pedidos: Math.floor(Math.random() * 20) + 14 },
    { mes: 'Jun', pedidos: pedidos.length || Math.floor(Math.random() * 20) + 16 }
  ];

  // Métricas adicionales
  const promedioPedidosPorCliente = totalClientes > 0 ? (totalPedidos / totalClientes).toFixed(1) : 0;
  const clientesConPedidos = pedidosPorCliente.length;
  const porcentajeClientesActivos = totalClientes > 0 ? ((clientesConPedidos / totalClientes) * 100).toFixed(1) : 0;

  // Card con icono reutilizable
  const MetricCard = ({ title, value, icon, color = "#1976d2", subtitle }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ color: color }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ color: color, fontWeight: 'bold' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Métricas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Clientes"
            value={totalClientes}
            icon={<PeopleIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Pedidos"
            value={totalPedidos}
            icon={<PedidosIcon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Productos"
            value={totalProductos}
            icon={<ProductosIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pedidos/Cliente"
            value={promedioPedidosPorCliente}
            icon={<TrendingIcon fontSize="large" />}
            color="#9c27b0"
            subtitle={`${porcentajeClientesActivos}% clientes activos`}
          />
        </Grid>
      </Grid>

      {/* Gráficos y estadísticas */}
      <Grid container spacing={3}>
        {/* Gráfico de pedidos por cliente */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pedidos por Cliente
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={pedidosPorCliente}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="pedidos" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Productos más populares */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Productos Más Pedidos
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={productosMasPedidos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, cantidad }) => `${nombre}: ${cantidad}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {productosMasPedidos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Tendencias mensuales */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencia de Pedidos
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={tendenciaMensual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="pedidos" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top clientes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Clientes Más Activos
                <Chip 
                  label="Top 5" 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              <List>
                {clientesTop.map((cliente, index) => (
                  <React.Fragment key={cliente.nombre}>
                    <ListItem>
                      <Box sx={{ mr: 2 }}>
                        <StarIcon sx={{ 
                          color: index === 0 ? '#FFD700' : 
                                 index === 1 ? '#C0C0C0' : 
                                 index === 2 ? '#CD7F32' : 'action.disabled' 
                        }} />
                      </Box>
                      <ListItemText 
                        primary={cliente.nombre} 
                        secondary={`${cliente.pedidos} pedidos`}
                      />
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        variant="outlined"
                      />
                    </ListItem>
                    {index < clientesTop.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {clientesTop.length === 0 && (
                  <ListItem>
                    <ListItemText 
                      primary="No hay datos disponibles" 
                      secondary="No se han registrado pedidos aún"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estado general */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen General
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Clientes con pedidos:
                  </Typography>
                  <Typography variant="h6">
                    {clientesConPedidos} / {totalClientes}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Tasa de actividad:
                  </Typography>
                  <Typography variant="h6">
                    {porcentajeClientesActivos}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Productos activos:
                  </Typography>
                  <Typography variant="h6">
                    {productosMasPedidos.length} / {totalProductos}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Estado del sistema:
                  </Typography>
                  <Chip 
                    label={totalPedidos > 0 ? "Activo" : "Inactivo"} 
                    color={totalPedidos > 0 ? "success" : "default"}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}