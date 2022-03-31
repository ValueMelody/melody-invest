import { useEffect, FunctionComponent } from 'react'
import { createUseStyles } from 'react-jss'
import { Message, Icon } from 'semantic-ui-react'
import Header from './blocks/Header'
import useCommonState from '../../states/useCommonState'
import useSystemState from '../../states/useSystemState'
import useUserState from '../../states/useUserState'

const useStyles = createUseStyles({
  main: {
    paddingTop: '4.5rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingBottom: '2rem',
  },
  messages: {
    marginTop: '4rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
})

const Layout: FunctionComponent = ({
  children,
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { messages, removeMessage } = useCommonState()
  const { getUser, fetchUserOverall } = useUserState()
  const { fetchSystemDefaults } = useSystemState()

  const user = getUser()

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    fetchSystemDefaults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!user.userType) return
    fetchUserOverall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userType])

  // ------------------------------------------------------------ Handler --

  const handleRemoveMessage = (id: number) => removeMessage(id)

  // ------------------------------------------------------------ Interface --

  return (
    <>
      <Header />
      {!!messages.length && (
        <div className={classes.messages}>
          {messages.map((message) => (
            <Message
              key={message.id}
              info={message.type === 'info'}
              success={message.type === 'success'}
              negative={message.type === 'error'}
              warning={message.type === 'warning'}
            >
              <div>
                <Message.Header>{message.title}</Message.Header>
                {message.desc && <p>{message.desc}</p>}
              </div>
              <Icon name='close' onClick={() => handleRemoveMessage(message.id)} />
            </Message>
          ))}
        </div>
      )}
      <main className={classes.main}>
        {children}
      </main>
    </>
  )
}

export default Layout
