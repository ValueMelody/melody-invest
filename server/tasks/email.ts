import * as adapterEnum from 'enums/adapter'
import * as processEmails from 'services/processEmails'

export const sendPendingEmails = async () => {
  console.info('Start sending emails')
  try {
    await processEmails.sendPendingEmails(adapterEnum.MailerConfig.BatchSize)
    console.info('emails sent')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}
