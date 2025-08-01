const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", async (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth()+1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const url = `https://wol.jw.org/wol/dt/r4/lp-s/${yyyy}/${mm}/${dd}`;

  try {
    const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const item = data?.items?.[0];
    if (!item) throw new Error("No hay items");
    // Sacamos versículo usando regex similar al gist
    const verseMatch = item.content.match(/<e m>(.*?)<\/e m>/);
    const scripture = verseMatch?.[1]?.trim() || "Versículo no encontrado";
    // El texto se toma del segundo <p>
    const text = (item.content.split("<p")[2]?.split(/>(.+)/)[1] || "").replace(/<[^>]+>/g, "").trim();

    res.json({ escritura: scripture, texto: text });
  } catch (e) {
    console.error(e.message);
    res.json({ escritura: "Error al cargar", texto: "Error al cargar" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server en puerto", port));
