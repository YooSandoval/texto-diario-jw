const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", async (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = today.getMonth() + 1;
  const dd = today.getDate();

  const url = `https://wol.jw.org/es/wol/dt/r4/lp-s/${yyyy}/${mm}/${dd}`;

  try {
    const resp = await axios.get(url);
    res.json({
      scripture: resp.data.scripture || "",
      text: resp.data.text || ""
    });
  } catch (e) {
    res.status(500).json({ error: "No se pudo obtener el texto diario." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Escuchando en puerto", port));
