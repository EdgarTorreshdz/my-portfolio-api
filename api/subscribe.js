import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // 1. Asegúrate de incluir tu dominio de Forge
  const allowedOrigins = [
    'https://printmotion-hbxwvbnp.on-forge.com',
    'https://printmotion.mx'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El email es requerido' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // 2. Correo específico para nuevos subscriptores
    await transporter.sendMail({
      from: `"PrintMotion" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: `¡Nuevo Subscriptor en PrintMotion!`,
      text: `Se ha registrado un nuevo subscriptor con el correo: ${email}`
    });

    return res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}