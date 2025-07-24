import express from "express";
import cors from "cors";
import pkg from "node-html-to-image";

const { nodeHtmlToImage } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ruta para convertir HTML en imagen
app.get("/imagen", async (req, res) => {
  const nombre = req.query.nombre || "Juan Pérez";
  const dni = req.query.dni || "12345678";

  try {
    const imageBuffer = await nodeHtmlToImage({
      output: "./output.png", // también se guarda localmente por si quieres revisar
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
              <p><strong>Nombre:</strong> ${nombre}</p>
              <p><strong>DNI:</strong> ${dni}</p>
              <p>Consulta realizada con éxito</p>
            </div>
          </body>
        </html>
      `,
      type: "png",
      encoding: "binary"
    });

    // Establece cabeceras para que se muestre y descargue como imagen
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline; filename=resultado.png");
    res.end(imageBuffer, "binary");
  } catch (error) {
    console.error("Error generando imagen:", error);
    res.status(500).send("Error generando la imagen");
  }
});

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
