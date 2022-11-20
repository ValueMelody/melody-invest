import * as commonEnum from 'enums/common'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import { Button, Card, Modal } from 'flowbite-react'
import SubscribeButton, { PlanType } from './SubscribeButton'
import classNames from 'classnames'
import { useState } from 'react'

const SubscribeModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [planType, setPlanType] = useState<PlanType>(constants.User.Type.Pro)

  const selectedProType = planType === constants.User.Type.Pro
  const selectedPremiumType = planType === constants.User.Type.Premium

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  const handleSelectType = (
    type: typeof constants.User.Type.Pro | typeof constants.User.Type.Premium,
  ) => {
    setPlanType(type)
  }

  return (
    <>
      <Button onClick={handleOpenModal}>
        {localeTool.t('common.subscribe')}
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
              <h5><b>{commonEnum.Plan.Pro.Price}</b></h5>
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
              <h5><b>{commonEnum.Plan.Premium.Price}</b></h5>
              {commonEnum.Plan.Premium.Services.map((service) => (
                <h5 key={service}>{service}</h5>
              ))}
            </Card>
          </section>
          <section className='flex mt-4 justify-center'>
            <SubscribeButton
              planType={planType}
              onCloseModal={handleCloseModal}
            />
          </section>
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

export default SubscribeModal
