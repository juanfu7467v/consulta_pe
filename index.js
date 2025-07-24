import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodeHtmlToImage from "node-html-to-image";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

app.use(cors());
app.use(express.json());

// Función para convertir un objeto JSON en una cadena HTML estilizada profesionalmente
const jsonToHtml = (endpoint, jsonObject) => {
  // Función auxiliar para capitalizar la primera letra de una cadena
  const capitalize = (s) => {
    if (typeof s !== 'string') return s;
    // Capitaliza la primera letra y convierte el resto a minúsculas
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  // Genera el contenido específico basado en el endpoint, si es necesario
  let dynamicContent = '';
  let title = 'Resultados de la Consulta';

  // Ajuste: La API de Leder Data para Reniec devuelve los datos bajo la clave 'result'
  if (endpoint.includes('reniec') && jsonObject && jsonObject.message === "found data" && jsonObject.result) {
    const data = jsonObject.result || {}; // Accede a la clave 'result'
    title = 'Información RENIEC';

    // Construye la URL de la imagen base64 si está disponible
    const photoSrc = data.imagenes && data.imagenes.foto ? `data:image/jpeg;base64,${data.imagenes.foto}` : '';

    dynamicContent = `
      <div class="flex flex-col md:flex-row items-start gap-8 mb-6">
          <div class="photo-container flex-shrink-0">
              ${photoSrc ? `<img src="${photoSrc}" alt="Foto DNI">` : `<span class="text-gray-400 text-center text-sm">Sin Foto</span>`}
          </div>
          <div class="flex-grow">
              <div class="mb-4">
                  <p class="detail-label">DNI:</p>
                  <p class="dni-highlight">${data.nuDni || 'No disponible'}</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                      <p class="detail-label">Nombres:</p>
                      <p class="detail-value">${capitalize(data.preNombres || '')}</p>
                  </div>
                  <div>
                      <p class="detail-label">Apellido Paterno:</p>
                      <p class="detail-value">${capitalize(data.apePaterno || '')}</p>
                  </div>
                  <div>
                      <p class="detail-label">Apellido Materno:</p>
                      <p class="detail-value">${capitalize(data.apeMaterno || '')}</p>
                  </div>
                  <div>
                      <p class="detail-label">Fecha de Nacimiento:</p>
                      <p class="detail-value">${data.feNacimiento || 'No disponible'}</p>
                  </div>
                  <div>
                      <p class="detail-label">Sexo:</p>
                      <p class="detail-value">${capitalize(data.sexo || 'No disponible')}</p>
                  </div>
                  <div>
                      <p class="detail-label">Estado Civil:</p>
                      <p class="detail-value">${capitalize(data.estadoCivil || 'No disponible')}</p>
                  </div>
                  <div>
                      <p class="detail-label">Restricción:</p>
                      <p class="detail-value">${capitalize(data.deRestriccion || 'NINGUNA')}</p>
                  </div>
              </div>
          </div>
      </div>
      <hr class="my-6 border-gray-200">
      <div class="text-center">
          <p class="detail-label">Dirección:</p>
          <p class="detail-value text-sm">${capitalize(data.desDireccion || 'No disponible')}, ${capitalize(data.distDireccion || '')}, ${capitalize(data.provDireccion || '')}, ${capitalize(data.departamento || '')}</p>
      </div>
    `;
  } else if (jsonObject && jsonObject.message && jsonObject.message.includes("not found")) {
    title = 'Datos no encontrados';
    dynamicContent = `
        <div class="text-center py-8">
            <p class="text-yellow-600 text-xl font-semibold mb-2">¡Atención!</p>
            <p class="text-gray-700">${jsonObject.message}</p>
            <p class="text-gray-500 text-sm mt-2">Verifica el DNI o los parámetros de búsqueda.</p>
        </div>
    `;
  }
  else if (jsonObject && jsonObject.success === false) {
    title = 'Error en la Consulta';
    dynamicContent = `
        <div class="text-center py-8">
            <p class="text-red-600 text-xl font-semibold mb-2">¡Error!</p>
            <p class="text-gray-700">${jsonObject.message || 'Ocurrió un error al procesar tu solicitud.'}</p>
            ${jsonObject.error ? `<p class="text-gray-500 text-sm mt-2">Detalle: ${jsonObject.error}</p>` : ''}
        </div>
    `;
  } else {
    // Si no es un endpoint específico o hay error, muestra el JSON crudo
    const jsonString = JSON.stringify(jsonObject, null, 2);
    dynamicContent = `
      <pre class="bg-gray-50 p-4 rounded-md text-gray-700 text-sm overflow-auto max-h-[400px]"><code>${jsonString}</code></pre>
    `;
  }

  return `
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #e0e7ff; /* Un azul claro muy suave */
            }
            .container-card {
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); /* Sombra más pronunciada */
                padding: 3rem; /* Más padding */
                max-width: 700px; /* Ancho un poco mayor */
                margin: 2rem auto;
                border: 2px solid #a7c0f8; /* Borde azul suave */
                position: relative;
                overflow: hidden; /* Para el efecto de fondo */
            }
            .container-card::before {
                content: '';
                position: absolute;
                top: -50px;
                left: -50px;
                right: -50px;
                bottom: -50px;
                background: radial-gradient(circle at top left, rgba(167, 192, 248, 0.1) 0%, transparent 50%);
                z-index: 0;
            }
            .content-wrapper {
                position: relative;
                z-index: 1; /* Asegura que el contenido esté por encima del pseudo-elemento */
            }
            .header-title {
                color: #2563eb; /* Azul más vibrante */
                margin-bottom: 1.5rem;
                border-bottom: 2px solid #bfdbfe; /* Línea separadora azul claro */
                padding-bottom: 1rem;
            }
            .detail-label {
                font-weight: 600; /* Semibold */
                color: #4b5563; /* Gris oscuro */
                font-size: 0.9rem;
                margin-bottom: 0.25rem;
            }
            .detail-value {
                color: #1f2937; /* Casi negro */
                font-size: 1rem;
                margin-bottom: 1rem;
            }
            .dni-highlight {
                font-size: 1.8rem; /* DNI más grande */
                font-weight: 700; /* Bold */
                color: #ef4444; /* Rojo distintivo */
            }
            .footer-text {
                font-size: 0.75rem;
                color: #9ca3af; /* Gris claro */
            }
            .photo-container {
                width: 120px;
                height: 150px;
                border: 2px solid #bfdbfe;
                border-radius: 8px;
                overflow: hidden;
                background-color: #e2e8f0; /* Fondo para la foto */
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 4px 10px rgba(0,0,0,0.08); /* Sombra para la foto */
            }
            .photo-container img {
                width: 100%;
                height: 100%;
                object-fit: cover; /* Asegura que la imagen cubra el área */
            }
            code {
                background-color: #f8fafc;
                border-radius: 6px;
                padding: 0.5em 0.75em;
            }
            pre {
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            pre::-webkit-scrollbar {
                display: none;
            }
            pre {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        </style>
    </head>
    <body class="bg-blue-50 p-8">
        <div class="container-card">
            <div class="content-wrapper">
                <h1 class="text-3xl font-extrabold header-title text-center">
                    <span class="text-blue-700">FICHA DE DATOS</span> <span class="text-gray-600">RENIEC</span>
                </h1>
                ${dynamicContent}
            </div>
            <p class="footer-text mt-6 text-center">Datos proporcionados por Leder Data API - Generado por tu API de Railway</p>
        </div>
    </body>
    </html>
  `;
};

// Función reutilizable modificada para enviar datos a Leder Data y devolver una imagen
const postToLederData = async (endpointPath, payload, res) => {
  try {
    const url = `https://leder-data-api.ngrok.dev/v1.7${endpointPath}`; // Construye la URL completa
    console.log(`[${new Date().toISOString()}] Realizando POST a: ${url} con payload:`, JSON.stringify(payload));

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[${new Date().toISOString()}] Error en la respuesta de Leder Data (${response.status}):`, errorText);
        // Intenta parsear como JSON si es posible, de lo contrario usa el texto
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch (e) {
            errorData = { message: `Error desconocido de Leder Data: ${errorText}` };
        }
        // Genera una imagen de error
        const errorHtmlContent = jsonToHtml(endpointPath, { success: false, message: `Error de la API externa (${response.status})`, error: errorData.message || errorText });
        const errorImage = await nodeHtmlToImage({
            html: errorHtmlContent,
            quality: 90,
            type: 'png',
            encoding: 'binary',
            selector: '.container-card',
            puppeteerArgs: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
        });
        res.writeHead(response.status, { 'Content-Type': 'image/png' });
        res.end(errorImage, 'binary');
        return; // Detener la ejecución aquí
    }

    const data = await response.json();
    console.log(`[${new Date().toISOString()}] Respuesta de Leder Data recibida:`, JSON.stringify(data).substring(0, 200) + '...'); // Limitar log

    // Convierte los datos JSON a HTML, pasando el endpoint para personalización
    const htmlContent = jsonToHtml(endpointPath, data);
    console.log(`[${new Date().toISOString()}] HTML generado. Intentando generar imagen...`);

    // Genera la imagen a partir del HTML
    const image = await nodeHtmlToImage({
      html: htmlContent,
      quality: 90,
      type: 'png',
      encoding: 'binary',
      // Añade un selector para capturar solo el div principal y no el fondo entero
      selector: '.container-card', // Captura solo la tarjeta de resultados
      puppeteerArgs: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Necesario para entornos como Railway/Docker
        // Puedes agregar más argumentos si es necesario, como la ruta al ejecutable de Chrome
      }
    });

    console.log(`[${new Date().toISOString()}] Imagen generada exitosamente. Enviando respuesta.`);
    // Envía la imagen como respuesta
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(image, 'binary');

  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error crítico al procesar solicitud para ${endpointPath}:`, err);
    // Genera una imagen de error genérico si algo falla completamente
    const genericErrorHtml = jsonToHtml(endpointPath, { success: false, message: "Error interno del servidor al generar la imagen.", error: err.message });
    const genericErrorImage = await nodeHtmlToImage({
        html: genericErrorHtml,
        quality: 90,
        type: 'png',
        encoding: 'binary',
        selector: '.container-card',
        puppeteerArgs: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    }).catch(e => {
        console.error(`[${new Date().toISOString()}] Fallo al generar imagen de error:`, e);
        return null; // Retorna null si incluso la imagen de error falla
    });

    if (genericErrorImage) {
        res.writeHead(500, { 'Content-Type': 'image/png' });
        res.end(genericErrorImage, 'binary');
    } else {
        // Como último recurso, envía un JSON de error si no se pudo generar la imagen de error
        res.status(500).json({ error: "Error al procesar la solicitud y no se pudo generar la imagen de error", detalle: err.message });
    }
  }
};

// Rutas tipo GET (como Factiliza) - Pasamos el fragmento de la URL como 'endpointPath'
app.get("/reniec", (req, res) => {
  postToLederData("/persona/reniec", {
    dni: req.query.dni,
    source: req.query.source || "database",
    token: TOKEN,
  }, res);
});

app.get("/denuncias-dni", (req, res) => {
  postToLederData("/persona/denuncias-policiales-dni", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/denuncias-placa", (req, res) => {
  postToLederData("/persona/denuncias-policiales-placa", {
    placa: req.query.placa,
    token: TOKEN,
  }, res);
});

app.get("/sueldos", (req, res) => {
  postToLederData("/persona/sueldos", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/trabajos", (req, res) => {
  postToLederData("/persona/trabajos", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/sunat", (req, res) => {
  postToLederData("/empresa/sunat", {
    data: req.query.data,
    token: TOKEN,
  }, res);
});

app.get("/sunat-razon", (req, res) => {
  postToLederData("/empresa/sunat/razon-social", {
    data: req.query.data,
    token: TOKEN,
  }, res);
});

app.get("/consumos", (req, res) => {
  postToLederData("/persona/consumos", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/arbol", (req, res) => {
  postToLederData("/persona/arbol-genealogico", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/familia1", (req, res) => {
  postToLederData("/persona/familia-1", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/familia2", (req, res) => {
  postToLederData("/persona/familia-2", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/familia3", (req, res) => {
  postToLederData("/persona/familia-3", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/movimientos", (req, res) => {
  postToLederData("/persona/movimientos-migratorios", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/matrimonios", (req, res) => {
  postToLederData("/persona/matrimonios", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/empresas", (req, res) => {
  postToLederData("/persona/empresas", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/direcciones", (req, res) => {
  postToLederData("/persona/direcciones", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/correos", (req, res) => {
  postToLederData("/persona/correos", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/telefonia-doc", (req, res) => {
  postToLederData("/telefonia/documento", {
    documento: req.query.documento,
    token: TOKEN,
  }, res);
});

app.get("/telefonia-num", (req, res) => {
  postToLederData("/telefonia/numero", {
    numero: req.query.numero,
    token: TOKEN,
  }, res);
});

app.get("/vehiculos", (req, res) => {
  postToLederData("/vehiculos/sunarp", {
    placa: req.query.placa,
    token: TOKEN,
  }, res);
});

app.get("/fiscalia-dni", (req, res) => {
  postToLederData("/persona/justicia/fiscalia/dni", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/fiscalia-nombres", (req, res) => {
  postToLederData("/persona/justicia/fiscalia/nombres", {
    nombres: req.query.nombres,
    apepaterno: req.query.apepaterno,
    apematerno: req.query.apematerno,
    token: TOKEN,
  }, res);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ API Factiliza-clon corriendo en puerto ${PORT}`);
});
