import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // CORS: permitir solo tu frontend
  res.setHeader('Access-Control-Allow-Origin', 'https://edgartorres.dev');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Solo POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Extraer datos
  const { name, email, message, website } = req.body;

  // Honeypot anti-spam
  if (website) return res.status(400).json({ message: 'Posible spam detectado' });

  // Validaciones simples
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    // Transporter de Gmail usando App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // Enviar correo
    await transporter.sendMail({
      from: `"Portafolio Web" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: `Nuevo mensaje de ${name}`,
      text: `De: ${name} <${email}>\n\n${message}`
    });

    return res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
