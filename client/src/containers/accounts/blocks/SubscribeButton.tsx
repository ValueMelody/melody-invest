import * as actions from 'actions'
import * as commonEnum from 'enums/common'
import * as constants from '@shared/constants'
import * as paypal from '@paypal/react-paypal-js'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

export type PlanType = typeof constants.User.Type.Pro | typeof constants.User.Type.Premium

const Button = ({
  planType,
  totalPrice,
  onCloseModal,
}: {
  planType: PlanType;
  totalPrice: string;
  onCloseModal: () => void;
}) => {
  const reduxDispatch = useDispatch<AppDispatch>()

  const [{ options }, dispatch] = paypal.usePayPalScriptReducer()

  useEffect(() => {
    if (!totalPrice) return
    dispatch({
      type: 'resetOptions',
      value: options,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice])

  const handleCloseModal = () => {
    onCloseModal()
  }

  const handleApproved = (subscriptionId: string) => {
    return
    reduxDispatch(actions.createUserSubscription({
      subscriptionId,
      planType,
    })).then(handleCloseModal)
  }

  return (
    <paypal.PayPalButtons
      createOrder = {async (data, actions) => {
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              value: totalPrice,
              currency_code: 'CAD',
            },
          }],
        })
      }}
      onApprove={async (data) => {
        console.log(data)
        await handleApproved(data.subscriptionID!)
      }}
    />
  )
}

const SubscribeButton = ({
  planType,
  totalPrice,
  onCloseModal,
}: {
  planType: PlanType;
  totalPrice: string;
  onCloseModal: () => void;
}) => {
  const handleCloseModal = () => {
    onCloseModal()
  }

  return (
    <paypal.PayPalScriptProvider
      options={{
        'client-id': commonEnum.Env.PayPalClientId,
        currency: 'CAD',
      }}
    >
      <Button
        planType={planType}
        totalPrice={totalPrice}
        onCloseModal={handleCloseModal}
      />
    </paypal.PayPalScriptProvider>
  )
}

export default SubscribeButton
