import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// CLIENTES
export const fetchClientes = async (setClientes) => {
  try {
    const res = await axios.get(`${BASE_URL}/clientes`);
    setClientes(res.data || []); // ← Siempre pasar array
  } catch (err) { 
    console.error('Error fetching clientes:', err);
    setClientes([]); // ← IMPORTANTE: setear array vacío en error
  }
};

export const agregarCliente = async (data, callback) => {
  try { 
    await axios.post(`${BASE_URL}/clientes`, data); 
    callback(); 
  } catch (err) { 
    console.error('Error agregando cliente:', err); 
    callback(err); // ← Pasar el error al callback
  }
};

export const editarCliente = async (id, data, callback) => {
  try { 
    await axios.put(`${BASE_URL}/clientes/${id}`, data); 
    callback(); 
  } catch (err) { 
    console.error('Error editando cliente:', err);
    callback(err);
  }
};

export const eliminarCliente = async (id, callback) => {
  try { 
    await axios.delete(`${BASE_URL}/clientes/${id}`); 
    callback(); 
  } catch (err) { 
    console.error('Error eliminando cliente:', err);
    callback(err);
  }
};

// PEDIDOS
export const fetchPedidos = async (setPedidos) => {
  try { 
    const res = await axios.get(`${BASE_URL}/pedidos`); 
    setPedidos(res.data || []); // ← Siempre pasar array
  } catch (err) { 
    console.error('Error fetching pedidos:', err);
    setPedidos([]); // ← IMPORTANTE: setear array vacío en error
  }
};

export const agregarPedido = async (data, callback) => {
  try { 
    await axios.post(`${BASE_URL}/pedidos`, data); 
    callback(); 
  } catch (err) { 
    console.error('Error agregando pedido:', err);
    callback(err);
  }
};

export const editarPedido = async (id, data, callback) => {
  try { 
    await axios.put(`${BASE_URL}/pedidos/${id}`, data); 
    callback(); 
  } catch (err) { 
    console.error('Error editando pedido:', err);
    callback(err);
  }
};

export const eliminarPedido = async (id, callback) => {
  try { 
    await axios.delete(`${BASE_URL}/pedidos/${id}`); 
    callback(); 
  } catch (err) { 
    console.error('Error eliminando pedido:', err);
    callback(err);
  }
};

// PRODUCTOS
export const fetchProductos = async (setProductos) => {
  try { 
    const res = await axios.get(`${BASE_URL}/productos`); 
    setProductos(res.data || []); // ← Siempre pasar array
  } catch (err) { 
    console.error('Error fetching productos:', err);
    setProductos([]); // ← IMPORTANTE: setear array vacío en error
  }
};

export const agregarProducto = async (data, callback) => {
  try { 
    await axios.post(`${BASE_URL}/productos`, data); 
    callback(); 
  } catch (err) { 
    console.error('Error agregando producto:', err);
    callback(err);
  }
};

export const editarProducto = async (id, data, callback) => {
  try { 
    await axios.put(`${BASE_URL}/productos/${id}`, data); 
    callback(); 
  } catch (err) { 
    console.error('Error editando producto:', err);
    callback(err);
  }
};

export const eliminarProducto = async (id, callback) => {
  try { 
    await axios.delete(`${BASE_URL}/productos/${id}`); 
    callback(); 
  } catch (err) { 
    console.error('Error eliminando producto:', err);
    callback(err);
  }
};
// AUTENTICACIÓN
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:5000/auth/login', credentials);
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
    const response = await axios.post('http://localhost:5000/auth/register', userData);
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
    const response = await axios.get('http://localhost:5000/auth/verify');
    return response.data;
  } catch (error) {
    return { success: false, message: 'Sesión expirada' };
  }
};

