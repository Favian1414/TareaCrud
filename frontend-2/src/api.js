import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// CLIENTES - CORREGIDAS
export const fetchClientes = async (setClientes) => {
  try {
    const res = await axios.get(`${BASE_URL}/clientes`);
    setClientes(res.data || []);
  } catch (err) { 
    console.error('Error fetching clientes:', err);
    setClientes([]);
  }
};

export const agregarCliente = async (data, callback) => {
  try { 
    const res = await axios.post(`${BASE_URL}/clientes`, data); 
    callback(null, res.data); // ← Pasar el cliente creado con ID real
  } catch (err) { 
    console.error('Error agregando cliente:', err); 
    callback(err, null);
  }
};

export const editarCliente = async (id, data, callback) => {
  try { 
    await axios.put(`${BASE_URL}/clientes/${id}`, data); 
    callback(null, { id, ...data }); // ← Pasar datos actualizados
  } catch (err) { 
    console.error('Error editando cliente:', err);
    callback(err, null);
  }
};

export const eliminarCliente = async (id, callback) => {
  try { 
    await axios.delete(`${BASE_URL}/clientes/${id}`); 
    callback(null);
  } catch (err) { 
    console.error('Error eliminando cliente:', err);
    callback(err);
  }
};


// PEDIDOS - CORREGIDAS (usa BASE_URL como las demás)
export const fetchPedidos = async (setPedidos) => {
  try {
    const res = await axios.get(`${BASE_URL}/pedidos`); // ← CORREGIDO
    console.log('📦 Pedidos recibidos:', res.data);
    setPedidos(res.data || []);
  } catch (err) { 
    console.error('Error fetching pedidos:', err);
    setPedidos([]);
  }
};

export const agregarPedido = async (data, callback) => {
  try {
    console.log('🔄 Enviando pedido:', data);
    const res = await axios.post(`${BASE_URL}/pedidos`, data); // ← CORREGIDO
    console.log('✅ Pedido creado:', res.data);
    callback(res.data);
  } catch (err) { 
    console.error('Error agregando pedido:', err);
    callback(err);
  }
};

export const editarPedido = async (id, data, callback) => {
  try {
    await axios.put(`${BASE_URL}/pedidos/${id}`, data); // ← CORREGIDO
    callback();
  } catch (err) { 
    console.error('Error editando pedido:', err);
    callback(err);
  }
};

export const eliminarPedido = async (id, callback) => {
  try {
    await axios.delete(`${BASE_URL}/pedidos/${id}`); // ← CORREGIDO
    callback();
  } catch (err) { 
    console.error('Error eliminando pedido:', err);
    callback(err);
  }
};

// PRODUCTOS - CORREGIDAS
export const fetchProductos = async (setProductos) => {
  try {
    const res = await axios.get(`${BASE_URL}/productos`);
    setProductos(res.data || []);
  } catch (err) { 
    console.error('Error fetching productos:', err);
    setProductos([]);
  }
};

export const agregarProducto = async (data, callback) => {
  try {
    const res = await axios.post(`${BASE_URL}/productos`, data);
    callback(null, res.data); // ← Pasar el producto creado con ID real
  } catch (err) { 
    console.error('Error agregando producto:', err);
    callback(err, null);
  }
};

export const editarProducto = async (id, data, callback) => {
  try {
    await axios.put(`${BASE_URL}/productos/${id}`, data);
    callback(null, { id, ...data }); // ← Pasar datos actualizados
  } catch (err) { 
    console.error('Error editando producto:', err);
    callback(err, null);
  }
};

export const eliminarProducto = async (id, callback) => {
  try {
    await axios.delete(`${BASE_URL}/productos/${id}`);
    callback(null);
  } catch (err) { 
    console.error('Error eliminando producto:', err);
    callback(err);
  }
};

// AUTENTICACIÓN
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error de conexión' 
    };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error de conexión' 
    };
  }
};

export const verifyAuth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/verify`);
    return response.data;
  } catch (error) {
    return { success: false, message: 'Sesión expirada' };
  }
};