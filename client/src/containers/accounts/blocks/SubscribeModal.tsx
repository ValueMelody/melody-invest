import { useState } from 'react'
import { Button, Modal, Card } from 'flowbite-react'
import classNames from 'classnames'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as commonEnum from 'enums/common'
import useCardStyle from 'styles/useCardStyle'
import useCommonStyle from 'styles/useCommonStyle'
import SubscribeButton, { PlanType } from './SubscribeButton'

const SubscribeModal = () => {
  // ------------------------------------------------------------ State --

  const { cardClasses } = useCardStyle()
  const { commonClasses } = useCommonStyle()

  const [isOpen, setIsOpen] = useState(false)
  const [planType, setPlanType] = useState<PlanType | null>(null)

  const selectedProType = planType === constants.User.Type.Pro
  const selectedPremiumType = planType === constants.User.Type.Premium

  // ------------------------------------------------------------ Handler --

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

  // ------------------------------------------------------------ UI --

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
                [commonClasses.cursorClickable],
                { [cardClasses.isActive]: selectedProType },
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
                [commonClasses.cursorClickable],
                { [cardClasses.isActive]: selectedPremiumType },
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
          {planType !== null && (
            <section className='flex mt-4 justify-center'>
              <SubscribeButton
                planType={planType}
                onCloseModal={handleCloseModal}
              />
            </section>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color='gray' onClick={handleCloseModal}>
            {localeTool.t('common.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SubscribeModal
