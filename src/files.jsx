import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import axios from 'axios';

function UploadForm() {
    const [files, setFiles] = useState([{ file: null, tipo: '' }]);

    const handleFileChange = (index, event) => {
        const newFiles = [...files];
        newFiles[index].file = event.target.files[0];
        setFiles(newFiles);
    };

    const handleTipoChange = (index, event) => {
        const newFiles = [...files];
        newFiles[index].tipo = event.target.value;
        setFiles(newFiles);
    };

    const handleAddMore = () => {
        setFiles([...files, { file: null, tipo: '' }]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        files.forEach((item, index) => {
            if (item.file && item.tipo) {
                formData.append(`archivos[${index}][archivo]`, item.file);
                formData.append(`archivos[${index}][tipo]`, item.tipo);
            }
        });

        // Imprime lo que se enviará
        console.log(formData.values);

        // Envía la solicitud
        try {
            const response = await axios.post('http://localhost:8000/archivos/api/archivo/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error al enviar el formulario', error);
        }
    };

    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="h6">Subir archivos</Typography>
            {files.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={`raised-button-file-${index}`}
                        multiple
                        type="file"
                        onChange={(e) => handleFileChange(index, e)}
                    />
                    <label htmlFor={`raised-button-file-${index}`}>
                        <Button variant="contained" component="span">
                            Subir Archivo {index + 1}
                        </Button>
                    </label>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id={`tipo-${index}`}
                        label="Tipo de archivo"
                        name="tipo"
                        autoComplete="tipo"
                        autoFocus
                        value={item.tipo}
                        onChange={(e) => handleTipoChange(index, e)}
                        sx={{ mt: 1 }}
                    />
                </Box>
            ))}
            <Button onClick={handleAddMore} variant="outlined" sx={{ mt: 3, mb: 2 }}>
                Añadir más archivos
            </Button>
            <Button onClick={handleSubmit} variant="contained" sx={{ mt: 1, mb: 2 }}>
                Enviar
            </Button>
            <Button onClick={() => console.log(files)} variant="contained" color="secondary" sx={{ mt: 1, mb: 2 }}>
                Imprimir Body
            </Button>
        </Box>
    );
}

export default UploadForm;
