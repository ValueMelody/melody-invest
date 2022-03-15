import * as databaseAdapter from '../adapters/database'
import * as userModel from '../models/user'
import * as generateTool from '../tools/generate'

export const createUser = async (
  email: string, password: string,
) => {
  let user = await userModel.getByUK(email)

  const transaction = await databaseAdapter.createTransaction()
  try {
    if (user && user.activationCode) {
      user = await userModel.update(user.id, {
        activationCode: generateTool.toSHA256(Math.random().toString()),
        activationSentAt: new Date(),
      }, transaction)
    }

    if (!user) {
      user = await userModel.create({
        email,
        password: generateTool.toSHA512(generateTool.toSHA256(password)),
        activationCode: generateTool.toSHA256(Math.random().toString()),
        activationSentAt: new Date(),
      }, transaction)
    }

    await transaction.commit()

    return user
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
