import { useEffect } from 'react'
import * as paypal from '@paypal/react-paypal-js'
import * as constants from '@shared/constants'
import useUserRequest from 'requests/useUserRequest'
import * as commonEnum from 'enums/common'

export type PlanType = typeof constants.User.Type.Pro | typeof constants.User.Type.Premium

const Button = ({
  planType,
  onCloseModal,
}: {
  planType: PlanType,
  onCloseModal: () => void,
}) => {
  // ------------------------------------------------------------ State --

  const { createUserSubscription } = useUserRequest()

  const [{ options }, dispatch] = paypal.usePayPalScriptReducer()

  const planId = planType === constants.User.Type.Pro
    ? commonEnum.Env.PayPalProPlanId
    : commonEnum.Env.PayPalPremiumPlanId

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        intent: 'subscription',
      },
    })
    // eslint-disable-next-line
  }, [])

  // ------------------------------------------------------------ Handler --

  const handleCloseModal = () => {
    onCloseModal()
  }

  const handleApproved = async (subscriptionId: string) => {
    await createUserSubscription(subscriptionId, planType)
    handleCloseModal()
  }

  // ------------------------------------------------------------ UI --

  return (
    <paypal.PayPalButtons
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
    <paypal.PayPalScriptProvider
      options={{
        'client-id': commonEnum.Env.PayPalClientId,
        components: 'buttons',
        intent: 'subscription',
        vault: true,
      }}
    >
      <Button planType={planType} onCloseModal={handleCloseModal} />
    </paypal.PayPalScriptProvider>
  )
}

export default SubscribeButton
