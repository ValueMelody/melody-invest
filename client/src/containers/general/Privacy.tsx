import { useEffect } from 'react'
import { TextArea } from 'semantic-ui-react'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import useSystemRequest from 'requests/useSystemRequest'
import useResourceState from 'states/useResourceState'
import useContentStyle from 'styles/useContentStyle'

const Privacy = () => {
  // ------------------------------------------------------------ State --

  const { contentClasses } = useContentStyle()
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
    <>
      <h2 className={contentClasses.pageTitle}>
        {localeTool.t('page.privacyPolicy')}
      </h2>
      <TextArea
        data-testid='privacy-content'
        className={contentClasses.contentTextarea}
        disabled
        value={policy.privacyPolicy || ''}
      />
    </>
  )
}

export default Privacy
