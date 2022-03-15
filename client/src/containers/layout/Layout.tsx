import { FunctionComponent } from 'react'
import { createUseStyles } from 'react-jss'
import { Message, Icon } from 'semantic-ui-react'
import Header from './blocks/Header'
import useCommon from '../../states/useCommon'

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
  const { messages, removeMessage } = useCommon()
  const handleRemoveMessage = (id: number) => removeMessage(id)

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
