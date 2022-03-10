import { FunctionComponent } from 'react'
import { createUseStyles } from 'react-jss'
import Header from './blocks/Header'

const useStyles = createUseStyles({
  main: {
    paddingTop: '4rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
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
