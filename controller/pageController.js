const nodemailer = require("nodemailer");

exports.getIndex = (req, res) => {
  res.status(200).render("index", {
    page_name: "index",
  });
};

exports.getAbout = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};

exports.sendEmail = async (req, res) => {
  const outputMessage = `
    <h1>Message Details</h1>
    <ul>
      <li>Name:${req.body.name}</li>
      <li>Email:${req.body.email}</li>
    </ul>
    <h1>Message</h1>
    <p>${req.body.message}</p>
  `;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "msungur33@gmail.com",
      pass: "ozzvqgzieeamwnba",
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Smart EDU Contact Form" <msungur33@gmail.com>', // sender address
    to: "mustafasungur.ozturkk@gmail.com", // list of receivers
    subject: "Smart EDU Contact Form", // Subject line
    html: outputMessage, // html body
  });

  console.log("Message sent: %s", info.messageId);

  res.status(200).redirect("contact");
};
