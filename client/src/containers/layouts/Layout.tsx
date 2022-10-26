import { FunctionComponent, useEffect } from 'react'
import classNames from 'classnames'
import { Message, Icon } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import useSystemRequest from 'requests/useSystemRequest'
import useUserRequest from 'requests/useUserRequest'
import useCommonState from 'states/useCommonState'
import useUserState from 'states/useUserState'
import useCommonStyle from 'styles/useCommonStyle'
import Header from 'containers/layouts/blocks/Header'
import Footer from 'containers/layouts/blocks/Footer'

const useStyles = createUseStyles({
  main: {
    paddingTop: '3rem',
    minHeight: '100vh',
  },
  children: {
    paddingTop: '1.5rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingBottom: '2rem',
    minHeight: 'calc(100vh - 7rem)',
    width: '100%',
  },
  messages: {
    position: 'fixed',
    top: '4rem',
    left: '1rem',
    right: '1rem',
    zIndex: 1000,
  },
})

const Layout: FunctionComponent = ({
  children,
}) => {
  // ------------------------------------------------------------ State --
  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

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
        <div className={classes.messages}>
          {messages.map((message) => (
            <Message
              data-testid='message'
              key={message.id}
              info={message.type === 'info'}
              success={message.type === 'success'}
              negative={message.type === 'error'}
              warning={message.type === 'warning'}
            >
              <div>
                <Message.Header>
                  {message.title}
                </Message.Header>
                {message.desc && <p>{message.desc}</p>}
              </div>
              <Icon
                name='close'
                onClick={() => handleRemoveMessage(message.id)}
              />
            </Message>
          ))}
        </div>
      )}
      <main className={classNames(
        classes.main,
        commonClasses.columnCenter,
      )}>
        <section className={classes.children}>
          {children}
        </section>
        <Footer />
      </main>
    </>
  )
}

export default Layout
