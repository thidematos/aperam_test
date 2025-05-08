const { getMessaging } = require('firebase-admin/messaging');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { isToday } = require('date-fns');

class cronVerifyEmails {
  constructor() {}

  async sendEmails() {
    const emails = await this._findEmails();
    const filteredEmails = this._verifiesIsToday(emails);
    await this._transportEmails(filteredEmails);
  }

  async _findEmails() {
    const db = mongoose.connection;

    const collections = await db.listCollections();

    const answerCollections = collections.filter((col) =>
      col.name.startsWith('Respostas_')
    );

    const emails = [];

    for (const collection of answerCollections) {
      const forms = await db.collection(collection.name).find().toArray();

      for (const form of forms) {
        for (const answer of form.respostas) {
          for (const field of answer.respostas) {
            if (field.type !== 'toggle-switch') continue;

            if (!isToday(field.value.dateToSend)) continue;

            emails.push(field.value);
          }
        }
      }
    }

    return emails;
  }

  async _verifiesIsToday(emails) {
    const filteredEmails = emails.filter((email) => isToday(email.dateToSend));

    return filteredEmails;
  }

  async _notifiesUser(emailsAdress, fcmToken) {
    const devices = await mongoose.connection
      .collection('dispositivos')
      .find()
      .toArray();

    if (!devices.some((device) => device.tokenFCM === fcmToken)) return;

    const message = {
      notification: {
        title: `Email enviado`,
        body: `Emails enviados para os seguintes endereços: ${emailsAdress.join(
          ' | '
        )}`,
      },
      token: fcmToken,
    };

    const isSend = await getMessaging().send(message);

    if (!isSend) return;

    console.log('Usuário notificado!');
  }

  async _transportEmails(emails) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Senha gerada pelo Google App Passwords
      },
    });

    for (const email of emails) {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email.emails,
        subject: email.subject, // Usa o título do toggle-switch como assunto
        text: email.body, // Usa o texto do toggle-switch como conteúdo do e-mail
      });

      console.log(
        `✅ E-mail enviado com sucesso para ${destinatario}: ${info.messageId}`
      );

      await this._notifiesUser(email.deviceToken);
    }
  }
}

module.exports = new cronVerifyEmails();
