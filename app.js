const express = require("express");
const bodyParser = require("body-parser");
const exhbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");
const sc = require("./sc");
const app = express();

const PORT = process.env.PORT || 4000;

app.engine("handlebars", exhbs());
app.set("view engine", "handlebars");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("contact", { layout: false });
});
app.post("/send", (req, res) => {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone Number: ${req.body.phone}</li>

  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
  `;
  async function main() {
    let transporter = nodemailer.createTransport({
      host: "mail.gmx.net",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: sc.sc.email, // generated ethereal user
        pass: sc.sc.pass // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Nodemailer Contact" <${sc.sc.email}>`, // sender address
      to: sc.sc.email, // list of receivers
      subject: "Contact Request", // Subject line
      text: "", // plain text body
      html: output // html body
    });

    console.log("Message sent: %s", info.messageId);
  }

  main()
    .then(() => {
      res.render("contact", { layout: false, msg: "Email succesfully sent" });
    })
    .catch(console.error);
});
app.listen(PORT, () => {
  console.log("server connected");
});
