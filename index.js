const express = require("express");
const { google } = require("googleapis");
var bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set app view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", { titulo: "My page" });
});

app.post("/", async (req, res) => {
  const nombre = req.body.nombre;
  const correo = req.body.correo;
  const telefono = req.body.telefono;
  const empresa = req.body.empresa;

  let fecha = new Date();
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZoneName: "short",
  };

  let fecharegistro =
    fecha.toLocaleDateString("es-MX", options) +
    " " +
    fecha.toLocaleTimeString("es-MX");

  if (!nombre || !correo || !telefono || !empresa) {
    return res.sendStatus(400);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  //Auth client Object
  const authClientObject = await auth.getClient();

  //Google sheets instance
  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  // spreadsheet id
  const spreadsheetId = "1Zyp7vcj6mBOzCKugWUBf3SiU5t9Y48rQ4rHc1HF_1o8";

  try {
    const response = await googleSheetsInstance.spreadsheets.values.append({
      auth, //auth object
      spreadsheetId, //spreadsheet id
      range: "A:C", //sheet name and range of cells
      valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
      resource: {
        values: [[nombre, correo, telefono, empresa, fecharegistro]],
      },
    });
    if (response.data) {
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(500).render("fallo", { titulo: "My page" });
    console.error(error);
  }
});

app.get("/download", async (req, res) => {
  res.download("./public/assets/example.txt");
});

app.get("/exito", (req, res) => {
  console.log("render exito");
  res.render("exito", { titulo: "My page" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
