import * as constants from '@shared/constants'
import * as vendorTool from 'tools/vendor'
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

  vendorTool.react.useEffect(() => {
    if (!policy.privacyPolicy) fetchSystemPolicy(constants.Content.PolicyType.Privacy)
  }, [policy.privacyPolicy])

  // ------------------------------------------------------------ UI --

  return (
    <>
      <h2 className={contentClasses.pageTitle}>
        {localeTool.t('page.privacyPolicy')}
      </h2>
      <vendorTool.ui.TextArea
        data-testid='privacy-content'
        className={contentClasses.contentTextarea}
        disabled
        value={policy.privacyPolicy || ''}
      />
    </>
  )
}

export default Privacy
