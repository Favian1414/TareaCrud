import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmDialog({ open, onClose, onConfirm, type }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar eliminación</DialogTitle>
      <DialogContent>
        <Typography>¿Estás seguro que quieres eliminar este {type}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" onClick={onConfirm}>Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}
