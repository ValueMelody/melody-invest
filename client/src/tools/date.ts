export const getVerifyISO = () => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 1)
  return date.toISOString()
}
