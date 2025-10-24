import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const allowedOrigins = [
    'https://edgartorres.dev',
    'https://www.edgartorres.dev',
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

  const { name, email, message, website, source } = req.body;

  if (website) return res.status(400).json({ message: 'Posible spam detectado' });
  if (!name || !email || !message) return res.status(400).json({ message: 'Todos los campos son requeridos' });

  const fromSite = source === 'PrintMotion' ? 'PrintMotion' : 'Portafolio Web';

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"${fromSite}" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: `Nuevo mensaje de ${name} (${fromSite})`,
      text: `De: ${name} <${email}>\n\n${message}`
    });

    return res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}