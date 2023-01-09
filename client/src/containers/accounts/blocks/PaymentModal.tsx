import * as commonEnum from 'enums/common'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import { Button, Card, Label, Modal, Radio } from 'flowbite-react'
import SubscribeButton, { PlanType } from './SubscribeButton'
import { useMemo, useState } from 'react'
import classNames from 'classnames'

const PaymentModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [planType, setPlanType] = useState<PlanType | null>(null)
  const [totalPrice, setTotalPrice] = useState('')

  const selectedProType = planType === constants.User.Type.Pro
  const selectedPremiumType = planType === constants.User.Type.Premium

  const priceOptions = useMemo(() => {
    const planPrice = selectedProType ? constants.User.PlanPrice.Pro : constants.User.PlanPrice.Premium
    return [
      {
        days: localeTool.t('pricing.unit', { num: 30 }),
        price: planPrice.OneMonthPrice,
      },
      {
        days: localeTool.t('pricing.unit', { num: 90 }),
        price: planPrice.ThreeMonthsPrice,
      },
      {
        days: localeTool.t('pricing.unit', { num: 180 }),
        price: planPrice.SixMonthsPrice,
      },
      {
        days: localeTool.t('pricing.unit', { num: 360 }),
        price: planPrice.OneYearPrice,
      },
    ]
  }, [selectedProType])

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setPlanType(null)
    setTotalPrice('')
    setIsOpen(false)
  }

  const handleSelectType = (
    type: typeof constants.User.Type.Pro | typeof constants.User.Type.Premium,
  ) => {
    if (type === constants.User.Type.Pro) setTotalPrice(constants.User.PlanPrice.Pro.OneMonthPrice)
    if (type === constants.User.Type.Premium) setTotalPrice(constants.User.PlanPrice.Premium.OneMonthPrice)
    setPlanType(type)
  }

  const handleChangeAmount = (value: string) => {
    setTotalPrice(value)
  }

  return (
    <>
      <Button onClick={handleOpenModal}>
        {localeTool.t('common.upgrade')}
      </Button>
      <Modal
        show={isOpen}
        onClose={handleCloseModal}
      >
        <Modal.Header>
          {localeTool.t('setting.selectPlan')}
        </Modal.Header>
        <Modal.Body className='flex flex-col'>
          <section className='flex justify-around'>
            <Card
              className={classNames(
                'cursor-pointer',
                { 'card-active': selectedProType },
              )}
              onClick={() => handleSelectType(constants.User.Type.Pro)}
            >
              <h4>{commonEnum.Plan.Pro.Title}</h4>
              {commonEnum.Plan.Pro.Services.map((service) => (
                <h5 key={service}>{service}</h5>
              ))}
            </Card>
            <Card
              className={classNames(
                'cursor-pointer',
                { 'card-active': selectedPremiumType },
              )}
              onClick={() => handleSelectType(constants.User.Type.Premium)}
            >
              <h4>{commonEnum.Plan.Premium.Title}</h4>
              {commonEnum.Plan.Premium.Services.map((service) => (
                <h5 key={service}>{service}</h5>
              ))}
            </Card>
          </section>
          {planType && (
            <section className='flex mt-6 justify-around'>
              <fieldset
                className='lex flex-col gap-4'
              >
                {priceOptions.map((option) => (
                  <div
                    key={option.price}
                    className='flex items-center gap-2 mb-2'
                  >
                    <Radio
                      id={option.days}
                      value={option.price}
                      checked={totalPrice === option.price}
                      onChange={() => handleChangeAmount(option.price)}
                    />
                    <Label htmlFor={option.days}>
                      {option.price} CAD - {option.days}
                    </Label>
                  </div>
                ))}
              </fieldset>
              <SubscribeButton
                planType={planType}
                totalPrice={totalPrice}
                onCloseModal={handleCloseModal}
              />
            </section>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            color='gray'
            onClick={handleCloseModal}
          >
            {localeTool.t('common.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PaymentModal
