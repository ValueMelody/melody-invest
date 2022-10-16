import * as processEmails from 'services/processEmails'
import * as adapterEnum from 'enums/adapter'

export const sendPendingEmails = async () => {
  await processEmails.sendPendingEmails(adapterEnum.MailerConfig.BatchSize)
}
