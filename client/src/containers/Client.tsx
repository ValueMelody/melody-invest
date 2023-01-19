import * as selectors from 'selectors'
import Router from './Router'
import { Spinner } from 'flowbite-react'
import { useSelector } from 'react-redux'

const Client = () => {
  const { isLoading } = useSelector(selectors.selectGlobal())

  return (
    <>
      {isLoading && (
        <div
          data-testid='loader'
          className='fixed h-screen w-full flex items-center justify-center'
        >
          <Spinner size='xl' />
        </div>
      )}
      <Router />
    </>
  )
}

export default Client
