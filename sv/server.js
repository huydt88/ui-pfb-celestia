const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const crypto = require("crypto");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

app.post(`${process.env.API}/genadata`, async (req, res) => {
  try {
    const id = crypto.randomBytes(8).toString("hex");

    const text = await req.body.mes;

    const mes = Buffer.from(text).toString("hex");
    res.json({ id, mes });
  } catch (err) {
    console.log(err);
    res.status(404).send("error");
  }
});

app.post(`${process.env.API}/submitpfb`, async (req, res) => {

  axios
    .post(`${process.env.LOCAL}/submit_pfb`, await req.body)
    .then((respo) => {
      res.json(respo.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send("error");
    });
});

app.get(
  `${process.env.API}/namespaced/:id/hight/:hight`,
  async (req, res) => {
    const { id, hight } = req.params;

    axios
      .get(`${process.env.LOCAL}/namespaced_shares/${id}/height/${hight}`)
      .then((respo) => {
        res.json(respo.data);
        console.log(respo.data);
      })
      .catch((error) => {
        console.error(error);
        res.json(error);
      });
  }
);

const port = process.env.PORT;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);
