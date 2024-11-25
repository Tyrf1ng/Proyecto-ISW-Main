import { useEffect, useState } from 'react';
import { useHorarios } from '@hooks/horarios/useHorarios';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Modal, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';

const Horarios = () => {
    const { horarios = [], fetchHorarios, addHorario, editHorario, removeHorario, error } = useHorarios();
    const [filterText, setFilterText] = useState('');
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [newHorario, setNewHorario] = useState({
        hora_inicio: '',
        hora_fin: '',
    });
    const [currentHorario, setCurrentHorario] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [editSuccess, setEditSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'hora_inicio', direction: 'asc' });

    const filteredHorarios = Array.isArray(horarios)
        ? horarios.filter((horario) => horario.hora_inicio && horario.hora_inicio.toLowerCase().includes(filterText.toLowerCase()))
        : [];

    const sortedHorarios = filteredHorarios.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'hora_inicio') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleFilterChange = (e) => setFilterText(e.target.value);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEditOpen = (horario) => {
        setCurrentHorario(horario);
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);
    const handleDeleteOpen = (horario) => {
        setCurrentHorario(horario);
        setDeleteOpen(true);
    };
    const handleDeleteClose = () => setDeleteOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHorario({ ...newHorario, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentHorario({ ...currentHorario, [name]: value });
    };

    const handleSubmit = async () => {
        if (!newHorario.hora_inicio || !newHorario.hora_fin) {
            setValidationError("Todos los campos son obligatorios");
            return;
        }
        await addHorario(newHorario);
        setCreateSuccess(true);
        setOpen(false);
        setNewHorario({ hora_inicio: '', hora_fin: '' });
        fetchHorarios();
    };

    const handleEditSubmit = async () => {
        if (!currentHorario.hora_inicio || !currentHorario.hora_fin) {
            setValidationError("Todos los campos son obligatorios");
            return;
        }
        await editHorario(currentHorario);
        setEditSuccess(true);
        setEditOpen(false);
        fetchHorarios();
    };

    const handleDelete = async () => {
        await removeHorario(currentHorario.id_horario);
        setDeleteSuccess(true);
        setDeleteOpen(false);
        fetchHorarios();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        console.log(horarios.data);
    }, [horarios]);

    return (
        <Box sx={{ padding: 4, minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#E3F2FD' }}>
                Horarios
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Snackbar
                open={!!deleteError}
                autoHideDuration={6000}
                onClose={() => setDeleteError(null)}
            >
                <Alert onClose={() => setDeleteError(null)} severity="error" sx={{ width: '100%' }}>
                    {deleteError}
                </Alert>
            </Snackbar>
            <Snackbar
                open={editSuccess}
                autoHideDuration={6000}
                onClose={() => setEditSuccess(false)}
            >
                <Alert onClose={() => setEditSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Cambios realizados
                </Alert>
            </Snackbar>
            <Snackbar
                open={deleteSuccess}
                autoHideDuration={6000}
                onClose={() => setDeleteSuccess(false)}
            >
                <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Horario eliminado con éxito
                </Alert>
            </Snackbar>
            <Snackbar
                open={createSuccess}
                autoHideDuration={6000}
                onClose={() => setCreateSuccess(false)}
            >
                <Alert onClose={() => setCreateSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Horario creado con éxito
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!validationError}
                autoHideDuration={6000}
                onClose={() => setValidationError(null)}
            >
                <Alert onClose={() => setValidationError(null)} severity="error" sx={{ width: '100%' }}>
                    {validationError}
                </Alert>
            </Snackbar>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                <TextField
                    label="Filtrar por hora de inicio"
                    variant="outlined"
                    value={filterText}
                    onChange={handleFilterChange}
                    sx={{
                        marginRight: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#59758C', // Cambia el color del borde aquí\
                          },
                          '&:hover fieldset': {
                            borderColor: '#133B5C', // Color del borde al pasar el cursor
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#133B5C', // Color del borde al enfocar
                            borderWidth: 1,
                          },
                        },
                      }}
                    InputLabelProps={{
                        style: { color: '#E3F2FD' },
                    }}
                    InputProps={{
                        style: { color: '#E3F2FD' },
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Crear Horario
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#E3F2FD' }}>
                                N° de Horario
                            </TableCell>
                            <TableCell sx={{ color: '#E3F2FD' }}>
                                Hora de Inicio
                                <IconButton size="small" onClick={() => handleSort('hora_inicio')}>
                                    {sortConfig.key === 'hora_inicio' && sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                </IconButton>
                            </TableCell>
                            <TableCell sx={{ color: '#E3F2FD' }}>
                                Hora de Fin
                                <IconButton size="small" onClick={() => handleSort('hora_fin')}>
                                    {sortConfig.key === 'hora_fin' && sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                </IconButton>
                            </TableCell>
                            <TableCell sx={{ color: '#E3F2FD' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedHorarios.map((horario) => (
                            <TableRow key={horario.id_horario}>
                                <TableCell sx={{ color: '#E3F2FD' }}>{horario.id_horario}</TableCell>
                                <TableCell sx={{ color: '#E3F2FD' }}>{horario.hora_inicio}</TableCell>
                                <TableCell sx={{ color: '#E3F2FD' }}>{horario.hora_fin}</TableCell>
                                <TableCell sx={{ color: '#E3F2FD' }}>
                                    <IconButton onClick={() => handleEditOpen(horario)}>
                                        <EditIcon sx={{ color: '#E3F2FD' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteOpen(horario)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>Crear Nuevo Horario</Typography>
                    <TextField
                        label="Hora de Inicio"
                        name="hora_inicio"
                        type="time"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newHorario.hora_inicio}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <TextField
                        label="Hora de Fin"
                        name="hora_fin"
                        type="time"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newHorario.hora_fin}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
                        Guardar
                    </Button>
                </Box>
            </Modal>

            <Modal open={editOpen} onClose={handleEditClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>Editar Horario</Typography>
                    <TextField
                        label="Hora de Inicio"
                        name="hora_inicio"
                        type="time"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentHorario?.hora_inicio || ''}
                        onChange={handleEditInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <TextField
                        label="Hora de Fin"
                        name="hora_fin"
                        type="time"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentHorario?.hora_fin || ''}
                        onChange={handleEditInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={handleEditSubmit} sx={{ marginTop: 2 }}>
                        Guardar
                    </Button>
                </Box>
            </Modal>

            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar el horario {currentHorario?.hora_inicio} - {currentHorario?.hora_fin}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Horarios;