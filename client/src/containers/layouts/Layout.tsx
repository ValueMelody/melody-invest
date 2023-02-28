import * as actions from 'actions'
import * as selectors from 'selectors'
import { FunctionComponent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from 'flowbite-react'
import Footer from 'containers/layouts/blocks/Footer'
import Header from 'containers/layouts/blocks/Header'
import { globalSlice } from 'stores/global'

const Layout: FunctionComponent = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const { messages } = useSelector(selectors.selectGlobal())
  const user = useSelector(selectors.selectUser())
  const global = useSelector(selectors.selectGlobal())

  useEffect(() => {
    dispatch(actions.fetchSystemDefaults())
  }, [dispatch])

  useEffect(() => {
    if (!global.refreshToken || user.userType) return
    dispatch(actions.fetchUserOverall())
  }, [global.refreshToken, user.userType, dispatch])

  useEffect(() => {
    if (!messages.length) return
    const clearMessage = setTimeout(() => {
      const msgId = messages[0].id
      dispatch(globalSlice.actions.removeMessage(msgId))
    }, 8000)
    return () => clearTimeout(clearMessage)
  }, [messages, dispatch])

  const handleRemoveMessage = (id: string) => {
    dispatch(globalSlice.actions.removeMessage(id))
  }

  return (
    <>
      <Header />
      {!!messages.length && (
        <section
          data-testid='messages'
          className='fixed top-16 left-4 right-4 z-40'
        >
          {messages.map((message) => (
            <Alert
              className='mb-4'
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
          style={{ minHeight: 'calc(100vh - 88px)' }}
        >
          {children}
        </section>
        <Footer />
      </main>
    </>
  )
}

export default Layout
