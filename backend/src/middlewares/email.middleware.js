import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para puerto 465, false para otros puertos
  auth: {
    user: "juntavecinosisw@gmail.com",
    pass: "ayfi zvtb fzun zybc"
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Error al verificar el transporte:", error);
  } else {
    console.log("Transporte listo para enviar correos");
  }
});

export async function sendEmail(to, subject, htmlContent) {
  const mailOptions = {
    from: `"Tu Comunidad" <${process.env.EMAIL_USER}>`, // mejor usar el usuario configurado
    to,
    subject,
    html: htmlContent,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email enviado correctamente:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando correo:", error.message);
    throw error; // relanza error para manejarlo donde llames la función
  }
}
