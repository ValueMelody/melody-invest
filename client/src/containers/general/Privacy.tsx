import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as selectors from 'selectors'
import { useDispatch, useSelector } from 'react-redux'
import { Textarea } from 'flowbite-react'
import { useEffect } from 'react'

const Privacy = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { privacyPolicy } = useSelector(selectors.selectContent())

  useEffect(() => {
    if (!privacyPolicy) dispatch(actions.fetchSystemPolicy(constants.Content.PolicyType.Privacy))
  }, [privacyPolicy, dispatch])

  return (
    <section className='flex flex-col items-center'>
      <h1 className='font-bold text-2xl mb-6'>
        {localeTool.t('page.privacyPolicy')}
      </h1>
      <section className='p-8 w-full'>
        <Textarea
          data-testid='privacy-content'
          style={{ height: 'calc(100vh - 300px)', minHeight: 300 }}
          disabled
          value={privacyPolicy?.content || ''}
        />
      </section>
    </section>
  )
}

export default Privacy
