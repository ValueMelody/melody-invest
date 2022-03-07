import { FunctionComponent } from 'react'
import Header from './blocks/Header'

const Layout: FunctionComponent = ({
  children,
}) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default Layout
