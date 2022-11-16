import * as actions from 'actions'
import * as commonEnum from 'enums/common'
import * as constants from '@shared/constants'
import * as paypal from '@paypal/react-paypal-js'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

export type PlanType = typeof constants.User.Type.Pro | typeof constants.User.Type.Premium

const Button = ({
  planType,
  onCloseModal,
}: {
  planType: PlanType,
  onCloseModal: () => void,
}) => {
  const reduxDispatch = useDispatch<AppDispatch>()

  const [{ options }, dispatch] = paypal.usePayPalScriptReducer()

  const planId = planType === constants.User.Type.Pro
    ? commonEnum.Env.PayPalProPlanId
    : commonEnum.Env.PayPalPremiumPlanId

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        intent: 'subscription',
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planType])

  const handleCloseModal = () => {
    onCloseModal()
  }

  const handleApproved = (subscriptionId: string) => {
    reduxDispatch(actions.createUserSubscription({
      subscriptionId,
      planType,
    })).then(handleCloseModal)
  }

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
      <Button
        planType={planType}
        onCloseModal={handleCloseModal}
      />
    </paypal.PayPalScriptProvider>
  )
}

export default SubscribeButton
