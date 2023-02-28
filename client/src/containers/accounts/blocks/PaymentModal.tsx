import * as commonEnum from 'enums/common'
import * as constants from '@shared/constants'
import * as helpers from '@shared/helpers'
import * as localeTool from 'tools/locale'
import { Button, Card, Label, Modal, Radio, Select } from 'flowbite-react'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import SubscribeButton from './SubscribeButton'
import classNames from 'classnames'

const PaymentModal = ({
  userType,
}: {
  userType: number;
}) => {
  const isBasicUser = userType === constants.User.Type.Basic

  const [isOpen, setIsOpen] = useState(false)
  const [planType, setPlanType] = useState<number>(isBasicUser ? constants.User.Type.Pro : userType)
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
    return helpers.getTaxAmount(totalPrice, stateCode, provinceCode)
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

  useEffect(() => {
    setPlanType(userType)
  }, [userType])

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
      <Button
        data-testid='upgradeBtn'
        onClick={handleOpenModal}
      >
        {isBasicUser ? localeTool.t('common.upgrade') : localeTool.t('setting.extendMoreTime')}
      </Button>
      <Modal
        data-testid='paymentModal'
        show={isOpen}
        onClose={handleCloseModal}
      >
        <Modal.Header>
          {localeTool.t('setting.selectPlan')}
        </Modal.Header>
        <Modal.Body className='flex flex-col px-16'>
          <section className='flex justify-between max-sm:flex-wrap'>
            {(isBasicUser || selectedProType) && (
              <Card
                data-testid='proCard'
                className={classNames(
                  'cursor-pointer mb-4',
                  { 'card-active': selectedProType },
                )}
                onClick={() => handleSelectType(constants.User.Type.Pro)}
              >
                <h4 className='font-bold'>{commonEnum.Plan.Pro.Title}</h4>
                {commonEnum.Plan.Pro.Services.map((service) => (
                  <h5 key={service}>{service}</h5>
                ))}
              </Card>
            )}
            {(isBasicUser || selectedPremiumType) && (
              <Card
                data-testid='premiumCard'
                className={classNames(
                  'cursor-pointer mb-4',
                  { 'card-active': selectedPremiumType },
                )}
                onClick={() => handleSelectType(constants.User.Type.Premium)}
              >
                <h4 className='font-bold'>{commonEnum.Plan.Premium.Title}</h4>
                {commonEnum.Plan.Premium.Services.map((service) => (
                  <h5 key={service}>{service}</h5>
                ))}
              </Card>
            )}
          </section>
          <section className='flex mt-6 justify-between max-sm:flex-wrap'>
            <Select
              data-testid='stateSelector'
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
                data-testid='provinceSelector'
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
          {!!planType && !!billingFilled && (
            <section className='flex justify-between mt-6 max-sm:flex-wrap'>
              <div className='mb-4'>
                <fieldset
                  className='lex flex-col gap-4'
                >
                  {priceOptions.map((option, index) => (
                    <div
                      key={option.price}
                      className='flex items-center gap-2 mb-2'
                    >
                      <Radio
                        data-testid={`paymentOption-${index}`}
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
                      <h5 data-testid='taxAmount'>{taxAmount}</h5>
                    </div>
                    <div className='flex justify-between border-t'>
                      <h4>Total</h4>
                      <h5 data-testid='totalAmount'>{totalAmount}</h5>
                    </div>
                  </>
                )}
              </div>
              {!!totalPrice && (
                <div className='mb-4'>
                  <SubscribeButton
                    planType={planType}
                    totalPrice={totalPrice}
                    taxAmount={taxAmount}
                    totalAmount={totalAmount}
                    stateCode={stateCode}
                    provinceCode={provinceCode}
                    onCloseModal={handleCloseModal}
                  />
                </div>
              )}
            </section>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            data-testid='closeBtn'
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
