import { useEffect } from 'react'
import { Textarea } from 'flowbite-react'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from 'actions'
import * as selectors from 'selectors'

const Terms = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { termsPolicy } = useSelector(selectors.selectContent())

  useEffect(() => {
    if (!termsPolicy) dispatch(actions.fetchSystemPolicy(constants.Content.PolicyType.TermsAndConditions))
  }, [termsPolicy, dispatch])

  return (
    <section className='flex flex-col items-center'>
      <h1 className='font-bold text-2xl mb-6'>
        {localeTool.t('page.termsPolicy')}
      </h1>
      <section className='p-8 w-full'>
        <Textarea
          data-testid='terms-content'
          style={{ height: 'calc(100vh - 300px)', minHeight: 300 }}
          disabled
          value={termsPolicy?.content || ''}
        />
      </section>
    </section>
  )
}

export default Terms
