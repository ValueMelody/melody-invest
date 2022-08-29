import * as constants from '@shared/constants'
import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import useSystemRequest from 'requests/useSystemRequest'
import useResourceState from 'states/useResourceState'
import useContentStyle from 'styles/useContentStyle'

const Terms = () => {
  // ------------------------------------------------------------ State --

  const { contentClasses } = useContentStyle()
  const { fetchSystemPolicy } = useSystemRequest()
  const { getPolicy } = useResourceState()
  const policy = getPolicy()

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (!policy.termsPolicy) fetchSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
  }, [policy.termsPolicy])

  // ------------------------------------------------------------ UI --

  return (
    <>
      <h2 className={contentClasses.pageTitle}>
        {localeTool.t('page.termsPolicy')}
      </h2>
      <vendorTool.ui.TextArea
        data-testid='terms-content'
        className={contentClasses.contentTextarea}
        disabled
        value={policy.termsPolicy || ''}
      />
    </>
  )
}

export default Terms
