import nodemailer from 'nodemailer'
import * as adpaterEnum from '../enums/adapter'

export const initTransporter = () => {
  return nodemailer.createTransport({
    host: adpaterEnum.MailerConfig.Host,
    port: adpaterEnum.MailerConfig.Port,
    secure: false,
    auth: {
      user: adpaterEnum.MailerConfig.Email,
      pass: adpaterEnum.MailerConfig.Password,
    },
  })
}
