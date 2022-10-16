import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as emailModel from 'models/email'
import * as databaseAdapter from 'adapters/database'
import * as emailAdapter from 'adapters/email'
import * as runTool from 'tools/run'

const getPendingEmails = async (
  total: number,
): Promise<
  interfaces.emailModel.Record[]
> => {
  const emails = await emailModel.getAll({
    total,
    conditions: [
      { key: 'status', value: constants.Email.Status.Pending },
    ],
  })

  if (!emails.length) return []

  const ids = emails.map((email) => email.id)
  return runTool.withTransaction(async (transaction) => {
    const emails = await emailModel.batchUpdate(
      { status: constants.Email.Status.Sending },
      [{ key: 'id', type: 'IN', value: ids }],
      transaction,
    )
    return emails
  })
}

export const sendPendingEmails = async (total: number) => {
  const emails = await getPendingEmails(total)

  if (!emails.length) return

  const transporter = emailAdapter.initTransporter()

  await runTool.asyncForEach(emails, async (email: interfaces.emailModel.Record) => {
    const response = await transporter.sendMail({
      from: `ValueMelody ${email.sendBy}`,
      to: email.sendTo,
      subject: email.title,
      html: email.content,
    })

    await runTool.withTransaction(async (transaction) => {
      const status = response?.accepted?.length && response?.accepted[0] === email.sendTo
        ? constants.Email.Status.Completed
        : constants.Email.Status.Failed

      await emailModel.update(email.id, {
        status,
        response,
        sentAt: new Date(),
      }, transaction)
    })
  })
}
