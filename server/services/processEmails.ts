import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as emailModel from '../models/email'
import * as databaseAdapter from '../adapters/database'
import * as runTool from '../tools/run'

const getPendingEmails = async (): Promise<
  interfaces.emailModel.Record[]
> => {
  const transaction = await databaseAdapter.createTransaction()
  try {
    const emails = await emailModel.batchUpdate(
      { status: constants.Email.Status.Sending },
      [{ key: 'status', value: constants.Email.Status.Pending }],
      20,
      transaction,
    )
    await transaction.commit()
    return emails
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const sendPendingEmails = async () => {
  const emails = await getPendingEmails()
  await runTool.asyncForEach(emails, (email: interfaces.emailModel.Record) => {

  })
}
