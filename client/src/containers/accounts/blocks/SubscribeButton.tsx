import * as constants from '@shared/constants'
import * as vendorTool from '../../../tools/vendor'

const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID!
const proPlanId = process.env.REACT_APP_PAYPAL_PRO_PLAN_ID!
const premiumPlanId = process.env.REACT_APP_PAYPAL_PREMIUM_PLAN_ID!

type PlanType = typeof constants.User.Type.Pro | typeof constants.User.Type.Premium

const Button = ({
  planType,
}: {
  planType: PlanType,
}) => {
  const [{ options }, dispatch] = vendorTool.paypal.usePayPalScriptReducer()

  const planId = planType === constants.User.Type.Pro ? proPlanId : premiumPlanId

  vendorTool.react.useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        intent: 'subscription',
      },
    })
  }, [])

  return (
    <vendorTool.paypal.PayPalButtons
      createSubscription={async (data, actions) => {
        return actions.subscription
          .create({ plan_id: planId })
          .then((orderId) => {
            console.log(orderId)
            return orderId
          })
      }}
      style={{
        label: 'subscribe',
      }}
    />
  )
}

const SubscribeButton = ({
  planType,
}: {
  planType: PlanType,
}) => {
  return (
    <vendorTool.paypal.PayPalScriptProvider
      options={{
        'client-id': clientId,
        components: 'buttons',
        intent: 'subscription',
        vault: true,
      }}
    >
      <Button planType={planType} />
    </vendorTool.paypal.PayPalScriptProvider>
  )
}

export default SubscribeButton
