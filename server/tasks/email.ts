import * as processEmails from '../services/processEmails'

export const sendPendingEmails = async () => {
  await processEmails.sendPendingEmails()
}
