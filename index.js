import express from "express";
import cors from "cors";
import axios from "axios";
import pkg from "node-html-to-image";

const { nodeHtmlToImage } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ruta para generar imagen solo con el DNI
app.get("/imagen", async (req, res) => {
  const dni = req.query.dni;

  if (!dni) {
    return res.status(400).send("Debe proporcionar un DNI");
  }

  try {
    // Obtener el nombre desde una API (cambia esta URL por la que tú uses)
    const url = `https://poxy-production.up.railway.app/reniec?dni=${dni}&source=database`;
    const response = await axios.get(url);
    const data = response.data;

    // Validamos que tenga nombre completo
    if (!data.nombres || !data.apellidoPaterno || !data.apellidoMaterno) {
      return res.status(404).send("No se encontró el nombre para este DNI");
    }

    const nombreCompleto = `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`;

    // Generar la imagen
    const imageBuffer = await nodeHtmlToImage({
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .card {
                border: 2px solid #25D366;
                padding: 20px;
                border-radius: 12px;
                background-color: #eaffea;
                text-align: center;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Resultado de Búsqueda</h1>
              <p><strong>Nombre:</strong> ${nombreCompleto}</p>
              <p><strong>DNI:</strong> ${dni}</p>
              <p>Consulta realizada con éxito</p>
            </div>
          </body>
        </html>
      `,
      type: "png",
      encoding: "binary"
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline; filename=resultado.png");
    res.end(imageBuffer, "binary");

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error al generar imagen");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
