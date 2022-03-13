import { FunctionComponent } from 'react'
import { createUseStyles } from 'react-jss'
import Header from './blocks/Header'

const useStyles = createUseStyles({
  main: {
    paddingTop: '4.5rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingBottom: '2rem',
  },
})

const Layout: FunctionComponent = ({
  children,
}) => {
  const classes = useStyles()

  return (
    <>
      <Header />
      <main className={classes.main}>
        {children}
      </main>
    </>
  )
}

export default Layout
