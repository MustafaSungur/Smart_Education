const nodemailer = require("nodemailer");
require("dotenv").config();
const Course = require("../models/Course");
const User = require("../models/User");
exports.getIndex = async (req, res) => {
  const coursesCount = await Course.countDocuments();
  const teacherCount = await User.countDocuments({ role: "teacher" });
  const studentCount = await User.countDocuments({ role: "student" });

  res.status(200).render("index", {
    page_name: "index",
    coursesCount,
    teacherCount,
    studentCount,
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
  try {
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
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD,
      },
    });

    // async..await is not allowed in global scope, must use a wrapper

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Smart EDU Contact Form" <${process.env.EMAIL}>`, // sender address
      to: process.env.ToEMAIL, // list of receivers
      subject: "Smart EDU Contact Form", // Subject line
      html: outputMessage, // html body
    });

    console.log("Message sent: %s", info.messageId);

    req.flash("success", "We Received Your Message");

    res.status(200).redirect("contact");
  } catch (err) {
    req.flash("error", "Message could not receiwed");
    res.status(404).redirect("contact");
  }
};
