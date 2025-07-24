import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

app.use(cors());
app.use(express.json());

// Función reutilizable
const postToLederData = async (url, payload, res) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al conectar con Leder Data", detalle: err.message });
  }
};

// Rutas tipo GET (como Factiliza)
app.get("/reniec", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/reniec", {
    dni: req.query.dni,
    source: req.query.source || "database",
    token: TOKEN,
  }, res);
});

app.get("/denuncias-dni", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/denuncias-policiales-dni", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/denuncias-placa", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/denuncias-policiales-placa", {
    placa: req.query.placa,
    token: TOKEN,
  }, res);
});

app.get("/sueldos", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/sueldos", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/trabajos", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/trabajos", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/sunat", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/empresa/sunat", {
    data: req.query.data,
    token: TOKEN,
  }, res);
});

app.get("/sunat-razon", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/empresa/sunat/razon-social", {
    data: req.query.data,
    token: TOKEN,
  }, res);
});

app.get("/consumos", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/consumos", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/arbol", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/arbol-genealogico", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/familia1", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/familia-1", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/familia2", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/familia-2", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/familia3", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/familia-3", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/movimientos", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/movimientos-migratorios", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/matrimonios", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/matrimonios", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/empresas", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/empresas", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/direcciones", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/direcciones", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/correos", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/correos", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/telefonia-doc", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/telefonia/documento", {
    documento: req.query.documento,
    token: TOKEN,
  }, res);
});

app.get("/telefonia-num", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/telefonia/numero", {
    numero: req.query.numero,
    token: TOKEN,
  }, res);
});

app.get("/vehiculos", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/vehiculos/sunarp", {
    placa: req.query.placa,
    token: TOKEN,
  }, res);
});

app.get("/fiscalia-dni", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/justicia/fiscalia/dni", {
    dni: req.query.dni,
    token: TOKEN,
  }, res);
});

app.get("/fiscalia-nombres", (req, res) => {
  postToLederData("https://leder-data-api.ngrok.dev/v1.7/persona/justicia/fiscalia/nombres", {
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
