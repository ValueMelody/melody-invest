import * as actions from 'actions'
import * as commonEnum from 'enums/common'
import * as paypal from '@paypal/react-paypal-js'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

const Button = ({
  planType,
  totalPrice,
  taxAmount,
  totalAmount,
  stateCode,
  provinceCode,
  onCloseModal,
}: {
  planType: number;
  totalPrice: string;
  taxAmount: string;
  totalAmount: string;
  stateCode: string;
  provinceCode: string;
  onCloseModal: () => void;
}) => {
  const reduxDispatch = useDispatch<AppDispatch>()

  const [{ options }, dispatch] = paypal.usePayPalScriptReducer()

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: options,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAmount])

  const handleCloseModal = () => {
    onCloseModal()
  }

  const handleApproved = (orderId: string) => {
    reduxDispatch(actions.createUserPayment({
      orderId,
      planType,
      stateCode,
      provinceCode,
    })).then(handleCloseModal)
  }

  return (
    <paypal.PayPalButtons
      createOrder = {async (data, actions) => {
        return actions.order.create({
          intent: 'CAPTURE',
          application_context: {
            user_action: 'PAY_NOW',
          },
          purchase_units: [{
            amount: {
              value: totalAmount,
              currency_code: 'CAD',
              breakdown: {
                item_total: {
                  value: totalPrice,
                  currency_code: 'CAD',
                },
                tax_total: {
                  value: taxAmount,
                  currency_code: 'CAD',
                },
              },
            },
          }],
        })
      }}
      onApprove={async (data) => {
        console.log(data)
        await handleApproved(data.orderID)
      }}
    />
  )
}

const SubscribeButton = ({
  planType,
  totalPrice,
  taxAmount,
  totalAmount,
  stateCode,
  provinceCode,
  onCloseModal,
}: {
  planType: number;
  totalPrice: string;
  taxAmount: string;
  totalAmount: string;
  stateCode: string;
  provinceCode: string;
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
        taxAmount={taxAmount}
        totalAmount={totalAmount}
        stateCode={stateCode}
        provinceCode={provinceCode}
        onCloseModal={handleCloseModal}
      />
    </paypal.PayPalScriptProvider>
  )
}

export default SubscribeButton
