import { FunctionComponent } from 'react'
import { createUseStyles } from 'react-jss'
import * as themeConstant from '../../constants/theme'
import Header from './blocks/Header'

const useStyles = createUseStyles((theme: themeConstant.THEME) => ({
  main: {
    paddingTop: 50 + theme.SPACING,
    paddingLeft: theme.SPACING,
    paddingRight: theme.SPACING,
  },
}))

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
