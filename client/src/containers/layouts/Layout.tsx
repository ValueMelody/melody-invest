import { FunctionComponent, useEffect } from 'react'
import { Alert } from 'flowbite-react'
import useSystemRequest from 'requests/useSystemRequest'
import useUserRequest from 'requests/useUserRequest'
import useCommonState from 'states/useCommonState'
import useUserState from 'states/useUserState'
import Header from 'containers/layouts/blocks/Header'
import Footer from 'containers/layouts/blocks/Footer'

const Layout: FunctionComponent = ({
  children,
}) => {
  // ------------------------------------------------------------ State --

  const { getMessages, removeMessage } = useCommonState()
  const { getUser } = useUserState()
  const { fetchSystemDefaults } = useSystemRequest()
  const { fetchUserOverall } = useUserRequest()

  const user = getUser()
  const messages = getMessages()

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    fetchSystemDefaults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!user.hasLogin || user.userType) return
    fetchUserOverall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.hasLogin, user.userType])

  useEffect(() => {
    if (!messages.length) return
    const clearMessage = setTimeout(() => {
      const msgId = messages[0].id
      removeMessage(msgId)
    }, 10000)
    return () => clearTimeout(clearMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  // ------------------------------------------------------------ Handler --

  const handleRemoveMessage = (id: number) => removeMessage(id)

  // ------------------------------------------------------------ UI --

  return (
    <>
      <Header />
      {!!messages.length && (
        <section className='fixed top-16 left-4 right-4 z-50'>
          {messages.map((message) => (
            <Alert
              className='mb-4'
              data-testid='message'
              key={message.id}
              color={message.type}
              onDismiss={() => handleRemoveMessage(message.id)}
              additionalContent={message.desc && <p className='mt-2 mb-4'>{message.desc}</p>}
            >
              <h4>
                {message.title}
              </h4>
            </Alert>
          ))}
        </section>
      )}
      <main className='pt-12 flex flex-col'>
        <section
          className='p-6 w-full'
          style={{ minHeight: 'calc(100vh - 7rem)' }}
        >
          {children}
        </section>
        <Footer />
      </main>
    </>
  )
}

export default Layout
