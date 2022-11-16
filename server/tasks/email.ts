import * as adapterEnum from 'enums/adapter'
import * as processEmails from 'services/processEmails'

export const sendPendingEmails = async () => {
  await processEmails.sendPendingEmails(adapterEnum.MailerConfig.BatchSize)
}
