const nodeMailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

class SendMail {
  constructor() {
    this.from = process.env.EMAIL_FROM;
  }

  injectDataToTemplate(data, template) {
    return pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      basedir: `${__dirname}/../views/`,
      data: data,
    });
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodeMailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.EMAIL_GRID_USER,
          pass: process.env.EMAIL_GRID_PASSWORD,
        },
      });
    }

    return nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(data, email, template, subject) {
    const html = this.injectDataToTemplate(data, template);

    const mailOptions = {
      from:
        process.env.NODE_ENV === 'production'
          ? process.env.EMAIL_GRID_FROM
          : this.from,
      to: email,
      subject: subject,
      html: html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendDummyMail(options) {
    const { data, email, template, subject } = options;

    await this.send(data, email, template, subject);
  }
}

module.exports = SendMail;
