import * as constants from '@shared/constants'
import * as vendorTool from '../../../tools/vendor'
import useRequest from '../../../states/useRequest'

const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID!
const proPlanId = process.env.REACT_APP_PAYPAL_PRO_PLAN_ID!
const premiumPlanId = process.env.REACT_APP_PAYPAL_PREMIUM_PLAN_ID!

type PlanType = typeof constants.User.Type.Pro | typeof constants.User.Type.Premium

const Button = ({
  planType,
  onCloseModal,
}: {
  planType: PlanType,
  onCloseModal: () => void,
}) => {
  // ------------------------------------------------------------ State --

  const { createUserPlan } = useRequest()

  const [{ options }, dispatch] = vendorTool.paypal.usePayPalScriptReducer()

  const planId = planType === constants.User.Type.Pro ? proPlanId : premiumPlanId

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        intent: 'subscription',
      },
    })
  }, [])

  // ------------------------------------------------------------ Handler --

  const handleCloseModal = () => {
    onCloseModal()
  }

  const handleApproved = async (subscriptionId: string) => {
    await createUserPlan(subscriptionId, planType)
    handleCloseModal()
  }

  // ------------------------------------------------------------ UI --

  return (
    <vendorTool.paypal.PayPalButtons
      createSubscription={async (data, actions) => actions.subscription.create({ plan_id: planId })}
      onApprove={async (data) => {
        await handleApproved(data.subscriptionID!)
      }}
      style={{ label: 'subscribe' }}
    />
  )
}

const SubscribeButton = ({
  planType,
  onCloseModal,
}: {
  planType: PlanType,
  onCloseModal: () => void,
}) => {
  // ------------------------------------------------------------ Handler --

  const handleCloseModal = () => {
    onCloseModal()
  }

  // ------------------------------------------------------------ UI --

  return (
    <vendorTool.paypal.PayPalScriptProvider
      options={{
        'client-id': clientId,
        components: 'buttons',
        intent: 'subscription',
        vault: true,
      }}
    >
      <Button planType={planType} onCloseModal={handleCloseModal} />
    </vendorTool.paypal.PayPalScriptProvider>
  )
}

export default SubscribeButton
