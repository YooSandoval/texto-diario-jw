const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", async (req, res) => {
  const now = new Date();
  now.setDate(now.getDate() - 1); // Ajuste por desfase UTC

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const diaSemana = dayNames[now.getDay()];
  const fechaStr = `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dd} de ${monthNames[now.getMonth()]}`;

  const url = `https://wol.jw.org/wol/dt/r4/lp-s/${yyyy}/${mm}/${dd}`;

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const item = data?.items?.[0];
    if (!item) throw new Error("No se encontró contenido del día");

    let escritura = item.contentTitle?.trim() || item.title?.trim() || "Versículo no disponible";

    // Eliminar todas las etiquetas HTML del contenido
    const rawContent = item.content
      .replace(/<[^>]*>/g, '') // quitar todo lo que esté entre < >
      .replace(/\s+/g, ' ')    // eliminar múltiples espacios
      .trim();

    res.json({
      fecha: fechaStr,
      escritura,
      texto: rawContent
    });

  } catch (e) {
    console.error(e.message);
    res.json({
      fecha: fechaStr,
      escritura: "Error al cargar",
      texto: "No se pudo obtener el texto diario."
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Servidor corriendo en puerto", port));
