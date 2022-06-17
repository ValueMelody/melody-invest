import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as emailModel from 'models/email'
import * as databaseAdapter from 'adapters/database'
import * as emailAdapter from 'adapters/email'
import * as runTool from 'tools/run'

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
  if (!emails.length) return

  const transporter = emailAdapter.initTransporter()

  await runTool.asyncForEach(emails, async (email: interfaces.emailModel.Record) => {
    const response = await transporter.sendMail({
      from: `ValueMelody ${email.sendBy}`,
      to: email.sendTo,
      subject: email.title,
      html: email.content,
    })

    const transaction = await databaseAdapter.createTransaction()
    try {
      const status = response?.accepted?.length && response?.accepted[0] === email.sendTo
        ? constants.Email.Status.Completed
        : constants.Email.Status.Failed

      await emailModel.update(email.id, {
        status,
        response,
        sentAt: new Date(),
      }, transaction)

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  })
}
