import { FunctionComponent, useEffect } from 'react'
import { Alert } from 'flowbite-react'
import Header from 'containers/layouts/blocks/Header'
import Footer from 'containers/layouts/blocks/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { removeMessage } from 'stores/global'
import * as actions from 'actions'
import * as selectors from 'selectors'

const Layout: FunctionComponent = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const { messages } = useSelector(selectors.selectGlobal())
  const user = useSelector(selectors.selectUser())

  useEffect(() => {
    dispatch(actions.fetchSystemDefaults())
  }, [dispatch])

  useEffect(() => {
    if (!user.hasLogin || user.userType) return
    dispatch(actions.fetchUserOverall())
  }, [user.hasLogin, user.userType, dispatch])

  useEffect(() => {
    if (!messages.length) return
    const clearMessage = setTimeout(() => {
      const msgId = messages[0].id
      dispatch(removeMessage(msgId))
    }, 8000)
    return () => clearTimeout(clearMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  const handleRemoveMessage = (id: string) => {
    dispatch(removeMessage(id))
  }

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
