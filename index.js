const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", async (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  const url = `https://wol.jw.org/es/wol/dt/r4/lp-s/${yyyy}/${mm}/${dd}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const scripture = data?.items?.[0]?.verse || "Versículo no encontrado";
    const text = data?.items?.[0]?.content?.replace(/<[^>]+>/g, "").trim() || "Texto no encontrado";

    res.json({ escritura: scripture, texto: text });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "No se pudo obtener el texto diario." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Escuchando en el puerto", port));
