const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", async (req, res) => {
  // Usamos fecha con -1 día para evitar que salga el texto de mañana
  const now = new Date();
  now.setDate(now.getDate() - 1); // ← Resta 1 día

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

    // Extraer versículo si existe
    const escritura = item.title?.includes("w") ? "Versículo no disponible" : item.title;

    // Extraer el segundo párrafo de contenido
    const paragraphs = item.content.split(/<p.*?>/g).filter(p => p.includes('</p>'));
    const rawText = paragraphs[1] || "";
    const cleanText = rawText.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

    res.json({
      fecha: fechaStr,
      escritura,
      texto: cleanText
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
