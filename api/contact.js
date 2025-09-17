import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://edgartorres.dev');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { name, email, message, website } = req.body;
  if (website) return res.status(400).json({ message: 'Posible spam detectado' });

  try {
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    });

    await transporter.sendMail({
      from: `"Portafolio Web" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: `Nuevo mensaje de ${name}`,
      text: `De: ${name} <${email}>\n\n${message}`
    });

    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

