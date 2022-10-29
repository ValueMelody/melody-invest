import { useEffect } from 'react'
import { Textarea } from 'flowbite-react'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import useSystemRequest from 'requests/useSystemRequest'
import useResourceState from 'states/useResourceState'

const Privacy = () => {
  // ------------------------------------------------------------ State --

  const { fetchSystemPolicy } = useSystemRequest()
  const { getPolicy } = useResourceState()
  const policy = getPolicy()

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!policy.privacyPolicy) fetchSystemPolicy(constants.Content.PolicyType.Privacy)
    // eslint-disable-next-line
  }, [policy.privacyPolicy])

  // ------------------------------------------------------------ UI --

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
          value={policy.privacyPolicy || ''}
        />
      </section>
    </section>
  )
}

export default Privacy
