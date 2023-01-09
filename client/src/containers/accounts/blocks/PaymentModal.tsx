import * as commonEnum from 'enums/common'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import { Button, Card, Label, Modal, Radio, Select } from 'flowbite-react'
import { ChangeEvent, useMemo, useState } from 'react'
import SubscribeButton from './SubscribeButton'
import classNames from 'classnames'

const PaymentModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [planType, setPlanType] = useState<number>(constants.User.Type.Pro)
  const [totalPrice, setTotalPrice] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [provinceCode, setProvinceCode] = useState('')

  const selectedProType = planType === constants.User.Type.Pro
  const selectedPremiumType = planType === constants.User.Type.Premium

  const stateOptions = useMemo(() => {
    const stateCodes = Object.keys(constants.User.BillingTax.State)
    return stateCodes.map((code) => ({
      label: localeTool.getStateName(code),
      value: code,
    }))
  }, [])

  const provinceOptions = useMemo(() => {
    if (stateCode === 'CA') {
      const provinceCodes = Object.keys(constants.User.BillingTax.State.CA.Province)
      return provinceCodes.map((code) => ({
        label: localeTool.getProvinceName(stateCode, code),
        value: code,
      }))
    }
    return []
  }, [stateCode])

  const billingFilled = useMemo(() => {
    if (stateCode === 'CA') return !!provinceCode
    return !!stateCode
  }, [stateCode, provinceCode])

  const taxAmount = useMemo(() => {
    const percentage = stateCode === 'CA' && provinceCode
      ? constants.User.BillingTax.State.CA.Province[
        provinceCode as keyof typeof constants.User.BillingTax.State.CA.Province
      ]
      : 0
    const tax = Math.round(parseFloat(totalPrice) * percentage * 100) / 100
    return tax.toFixed(2)
  }, [stateCode, provinceCode, totalPrice])

  const totalAmount = useMemo(() => {
    const total = parseFloat(totalPrice) + parseFloat(taxAmount)
    return total.toFixed(2)
  }, [totalPrice, taxAmount])

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
    setPlanType(constants.User.Type.Pro)
    setTotalPrice('')
    setIsOpen(false)
  }

  const handleSelectType = (
    type: typeof constants.User.Type.Pro | typeof constants.User.Type.Premium,
  ) => {
    setTotalPrice('')
    setPlanType(type)
  }

  const handleChangeAmount = (value: string) => {
    setTotalPrice(value)
  }

  const handleSelectState = (e: ChangeEvent<HTMLSelectElement>) => {
    setProvinceCode('')
    setStateCode(e.target.value)
  }

  const handleSelectProvince = (e: ChangeEvent<HTMLSelectElement>) => {
    setProvinceCode(e.target.value)
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
        <Modal.Body className='flex flex-col px-16'>
          <section className='flex justify-between'>
            <Card
              className={classNames(
                'cursor-pointer',
                { 'card-active': selectedProType },
              )}
              onClick={() => handleSelectType(constants.User.Type.Pro)}
            >
              <h4 className='font-bold'>{commonEnum.Plan.Pro.Title}</h4>
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
              <h4 className='font-bold'>{commonEnum.Plan.Premium.Title}</h4>
              {commonEnum.Plan.Premium.Services.map((service) => (
                <h5 key={service}>{service}</h5>
              ))}
            </Card>
          </section>
          <section className='flex mt-6 justify-between'>
            <Select
              onChange={handleSelectState}
              value={stateCode}
              className='w-52'
            >
              <option hidden>{localeTool.t('setting.stateSelectPlaceholder')}</option>
              {stateOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </Select>
            {stateCode === 'CA' && (
              <Select
                onChange={handleSelectProvince}
                value={provinceCode}
                className='w-52'
              >
                <option hidden>{localeTool.t('setting.provinceSelectPlaceholder')}</option>
                {provinceOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </section>
          <h5>* {localeTool.t('setting.billingVerificationNote')}</h5>
          {planType && billingFilled && (
            <section className='flex justify-between mt-6'>
              <div>
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
                {totalPrice && !!parseFloat(taxAmount) && (
                  <>
                    <div className='flex justify-between'>
                      <h4>Tax</h4>
                      <h5>{taxAmount}</h5>
                    </div>
                    <div className='flex justify-between border-t'>
                      <h4>Total</h4>
                      <h5>{totalAmount}</h5>
                    </div>
                  </>
                )}
              </div>
              {!!totalPrice && (
                <SubscribeButton
                  planType={planType}
                  totalPrice={totalPrice}
                  taxAmount={taxAmount}
                  totalAmount={totalAmount}
                  stateCode={stateCode}
                  provinceCode={provinceCode}
                  onCloseModal={handleCloseModal}
                />
              )}
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
