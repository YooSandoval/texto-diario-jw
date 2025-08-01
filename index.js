const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", async (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const url = `https://wol.jw.org/wol/dt/r4/lp-s/${yyyy}/${mm}/${dd}`;

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const item = data?.items?.[0];

    if (!item) throw new Error("No se encontró el item del día");

    const scripture = item.title || "Versículo no encontrado";

    // Extraer el segundo párrafo (explicación)
    const paragraphs = item.content.split(/<p.*?>/g).filter(p => p.includes('</p>'));
    const rawText = paragraphs[1] || "";
    const cleanText = rawText.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

    res.json({ escritura: scripture, texto: cleanText });
  } catch (e) {
    console.error(e.message);
    res.json({ escritura: "Error al cargar", texto: "Error al cargar" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Servidor corriendo en puerto", port));
