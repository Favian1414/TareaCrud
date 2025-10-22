import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Switch, 
  FormControlLabel, 
  Grid,
  RadioGroup,
  Radio,
  FormLabel
} from '@mui/material';

export default function ClienteForm({ onSubmit, initialData }) {
  const [cliente, setCliente] = useState({
    tipo: 'persona',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    celular: '',
    dni_ruc: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigo_postal: '',
    fecha_nacimiento: '',
    genero: '',
    categoria: 'normal',
    puntos: 0,
    activo: true
  });

  useEffect(() => {
    if (initialData) {
      setCliente({
        tipo: initialData.tipo || 'persona',
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        email: initialData.email || '',
        telefono: initialData.telefono || '',
        celular: initialData.celular || '',
        dni_ruc: initialData.dni_ruc || '',
        direccion: initialData.direccion || '',
        ciudad: initialData.ciudad || '',
        departamento: initialData.departamento || '',
        codigo_postal: initialData.codigo_postal || '',
        fecha_nacimiento: initialData.fecha_nacimiento || '',
        genero: initialData.genero || '',
        categoria: initialData.categoria || 'normal',
        puntos: initialData.puntos || 0,
        activo: initialData.activo !== undefined ? initialData.activo : true
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const datosEnviar = {
      ...cliente,
      puntos: parseInt(cliente.puntos) || 0
    };

    onSubmit(datosEnviar);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCliente(prev => ({
      ...prev,
      [name]: name === 'activo' ? checked : value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
      <Grid container spacing={2}>
        
        {/* Fila 1: Tipo y Nombre */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <FormLabel component="legend">Tipo de Cliente</FormLabel>
            <RadioGroup
              name="tipo"
              value={cliente.tipo}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="persona" control={<Radio />} label="Persona" />
              <FormControlLabel value="empresa" control={<Radio />} label="Empresa" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={5}>
          <TextField
            required
            fullWidth
            label={cliente.tipo === 'empresa' ? 'Nombre de la Empresa' : 'Nombre'}
            name="nombre"
            value={cliente.nombre}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={cliente.tipo === 'empresa' ? 'Representante' : 'Apellido'}
            name="apellido"
            value={cliente.apellido}
            onChange={handleChange}
          />
        </Grid>

        {/* Fila 2: Documento y Contacto */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={cliente.tipo === 'empresa' ? 'RUC' : 'DNI'}
            name="dni_ruc"
            value={cliente.dni_ruc}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={cliente.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
          />
        </Grid>

        {/* Fila 3: Contacto adicional y Ubicación */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Celular"
            name="celular"
            value={cliente.celular}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Ciudad"
            name="ciudad"
            value={cliente.ciudad}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Departamento"
            name="departamento"
            value={cliente.departamento}
            onChange={handleChange}
          />
        </Grid>

        {/* Fila 4: Dirección completa */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dirección Completa"
            name="direccion"
            multiline
            rows={2}
            value={cliente.direccion}
            onChange={handleChange}
          />
        </Grid>

        {/* Fila 5: Información personal */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Fecha de Nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={cliente.fecha_nacimiento}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Género</InputLabel>
            <Select
              name="genero"
              value={cliente.genero}
              label="Género"
              onChange={handleChange}
            >
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Código Postal"
            name="codigo_postal"
            value={cliente.codigo_postal}
            onChange={handleChange}
          />
        </Grid>

        {/* Fila 6: Categoría y Puntos */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="categoria"
              value={cliente.categoria}
              label="Categoría"
              onChange={handleChange}
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="frecuente">Frecuente</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Puntos de Fidelidad"
            name="puntos"
            value={cliente.puntos}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>

        {/* Fila 7: Estado y Botón */}
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={cliente.activo}
                onChange={handleChange}
                name="activo"
                color="primary"
              />
            }
            label="Cliente Activo"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Button type="submit" variant="contained" fullWidth size="large">
            {initialData ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}