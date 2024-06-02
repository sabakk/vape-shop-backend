import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const SES_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
};
const sesClient = new SESClient(SES_CONFIG);

export const sendEmail = async (recipientEmail, token) => {
  const url = `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/reset/${token}`;

  const params = {
    Source: process.env.AWS_SES_EMAIL_SENDER,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: url,
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'Change password',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Change password',
      },
    },
  };
  try {
    const sendEmailCommand = new SendEmailCommand(params);
    const res = await sesClient.send(sendEmailCommand);
    console.log('email has been sent', res);
  } catch (e) {
    console.error(e);
  }
};
