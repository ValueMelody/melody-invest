import * as vendorTool from 'tools/vendor'
import useSystemRequest from 'requests/useSystemRequest'
import useUserRequest from 'requests/useUserRequest'
import useCommonState from 'states/useCommonState'
import useUserState from 'states/useUserState'
import useCommonStyle from 'styles/useCommonStyle'
import Header from 'containers/layouts/blocks/Header'
import Footer from 'containers/layouts/blocks/Footer'

const useStyles = vendorTool.jss.createUseStyles({
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

const Layout: vendorTool.react.FunctionComponent = ({
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

  vendorTool.react.useEffect(() => {
    fetchSystemDefaults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  vendorTool.react.useEffect(() => {
    if (!user.hasLogin || user.userType) return
    fetchUserOverall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.hasLogin, user.userType])

  vendorTool.react.useEffect(() => {
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
            <vendorTool.ui.Message
              data-testid='message'
              key={message.id}
              info={message.type === 'info'}
              success={message.type === 'success'}
              negative={message.type === 'error'}
              warning={message.type === 'warning'}
            >
              <div>
                <vendorTool.ui.Message.Header>
                  {message.title}
                </vendorTool.ui.Message.Header>
                {message.desc && <p>{message.desc}</p>}
              </div>
              <vendorTool.ui.Icon
                name='close'
                onClick={() => handleRemoveMessage(message.id)}
              />
            </vendorTool.ui.Message>
          ))}
        </div>
      )}
      <main className={vendorTool.classNames(
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
