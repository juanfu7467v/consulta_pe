import express from "express";
import cors from "cors";
import { nodeHtmlToImage } from "node-html-to-image";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ruta para generar imagen
app.get("/imagen", async (req, res) => {
  const dni = req.query.dni || "12345678";
  const nombre = req.query.nombre || "Juan Pérez";

  try {
    const imageBuffer = await nodeHtmlToImage({
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #e5f5ec;
              }
              .container {
                border: 2px solid #25d366;
                padding: 30px;
                border-radius: 10px;
                background-color: white;
                width: 500px;
                margin: auto;
                text-align: center;
              }
              h1 {
                color: #128c7e;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Resultado de Consulta</h1>
              <p><strong>DNI:</strong> ${dni}</p>
              <p><strong>Nombre:</strong> ${nombre}</p>
            </div>
          </body>
        </html>
      `,
      type: "png",
      encoding: "buffer",
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline; filename=result.png");
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error al generar imagen:", error);
    res.status(500).send("Error al generar imagen.");
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente ✔️");
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
