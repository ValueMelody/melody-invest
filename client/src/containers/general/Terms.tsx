import { useEffect } from 'react'
import { Textarea } from 'flowbite-react'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import useSystemRequest from 'requests/useSystemRequest'
import useResourceState from 'states/useResourceState'

const Terms = () => {
  // ------------------------------------------------------------ State --

  const { fetchSystemPolicy } = useSystemRequest()
  const { getPolicy } = useResourceState()
  const policy = getPolicy()

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!policy.termsPolicy) fetchSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
    // eslint-disable-next-line
  }, [policy.termsPolicy])

  // ------------------------------------------------------------ UI --

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
          value={policy.termsPolicy || ''}
        />
      </section>
    </section>
  )
}

export default Terms
