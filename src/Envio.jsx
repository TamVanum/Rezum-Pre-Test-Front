import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography } from '@mui/material';

function CombinedForm() {
  // Estados para cuestionarios y preoperatorio
  const [cuestionarios, setCuestionarios] = useState({
      ipss: {
        vaciado_incompleto: 3,
        frecuencia: 4,
        intermitencia: 2,
        urgencia: 3,
        chorro_debil: 2,
        esfuerzo: 2,
        nicturia: 3,
        calidad_de_vida: 4,
      },
      mshq: {
        frecuencia_eyaculacion: 2,
        fuerza_eyaculacion: 2,
        cantidad_eyaculacion: 3,
        dificultad_eyaculacion: 2,
      },
      udi_6: {
        orina_frecuencia: 2,
        perdida_orina_urgencia: 3,
        perdida_orina_actividad: 1,
        perdida_orina_pequeñas_cantidades: 1,
        dificultad_vaciar_vejiga: 2,
        dolor_zona_abdomen_genital: 3,
      },
      iief: {
        confianza_mantenimiento: 1,
        frecuencia_dureza: 2,
        frecuencia_mantenimiento: 3,
        dificultad_mantenimiento: 2,
        satisfaccion_sexual: 1,
      },
  })

  const [preoperatorio, setPreoperatorio] = useState({
      cirugia_prostata_otro: 'Cirugía de próstata láser',
      consume_cafe_escala: 2,
      orinar_dolor_escala: 1,
      orgasmo_eyacular: 'Normal',
      infeccion_urinaria: false,
      orina_sangre: false,
      retencion_sonda: false,
      usuario_sonda: false,
      familiar_problemas_prostata: false,
      familiar_directo_cancer: false,
      biopsia_prostata_cantidad: 2,
      paciente_id: 4,
      medicamentos_generales: [],
      medicamentos_prostata: [],
      enfermedades_neurologicas: [],
      enfermedades_preoperatorio: [],
      cirugias_existentes_preoperatorio: [],
  })

  const [archivos, setArchivos] = useState([]);


  // Estado para manejar múltiples archivos y tipos
  const [files, setFiles] = useState([{ file: null, tipo: '' }]);

  // Agregar un nuevo archivo y tipo al estado
  const handleAddMoreFiles = () => {
    setFiles([...files, { file: null, tipo: '' }]);
  };

  // Actualizar el archivo en el estado
  const handleFileChange = (index, event) => {
    const newFiles = [...files];
    newFiles[index].file = event.target.files[0];
    console.log(newFiles)
    setFiles(newFiles);
  };

  // Actualizar el tipo en el estado
  const handleTipoChange = (index, event) => {
    const newFiles = [...files];
    newFiles[index].tipo = event.target.value;
    setFiles(newFiles);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('cuestionarios', JSON.stringify(cuestionarios));
    formData.append('preoperatorio', JSON.stringify(preoperatorio));


    files.forEach((file, index) => {
      console.log(file)
      if (file.file && file.tipo) {
        formData.append(`archivos[${index}][archivo]`, file.file);
        formData.append(`archivos[${index}][tipo]`, file.tipo);
      }
    });

    try {
      const response = await axios.post('http://localhost:8000/fase_pre/preoperatorio/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Solicitud exitosa:', response.data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error.response?.data || error);
    }
  };


  const previewFormData = () => {
    const formData = new FormData();
    formData.append('cuestionarios', JSON.stringify(cuestionarios));
    formData.append('preoperatorio', JSON.stringify(preoperatorio));

    files.forEach((file, index) => {
      if (file.file && file.tipo) {
        formData.append(`archivos[${index}][archivo]`, file.file);
        formData.append(`archivos[${index}][tipo]`, file.tipo);
      }
    });

    // Loguear el contenido de FormData
    console.log('FormData content:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="h6">Formulario Combinado</Typography>
      {/* Inputs para cuestionarios y preoperatorio aquí */}
      
      {files.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id={`file-input-${index}`}
            multiple
            type="file"
            onChange={(e) => handleFileChange(index, e)}
          />
          <label htmlFor={`file-input-${index}`}>
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
      <Button onClick={handleAddMoreFiles} variant="outlined" sx={{ mt: 3, mb: 2 }}>
        Añadir más archivos
      </Button>
      <Button onClick={handleSubmit} variant="contained" sx={{ mt: 1, mb: 2 }}>
        Enviar
      </Button>
      <Button onClick={previewFormData} variant="contained" color="primary" sx={{ mt: 1, mb: 2 }}>
        Previsualizar Body
      </Button>
    </Box>
  );
}

export default CombinedForm;
