import { useState } from 'react'
import { Modal, Button, Card, CardContent, CardHeader, CardDescription } from 'semantic-ui-react'
import classNames from 'classnames'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as commonEnum from 'enums/common'
import useCardStyle from 'styles/useCardStyle'
import useCommonStyle from 'styles/useCommonStyle'
import SubscribeButton from './SubscribeButton'

const SubscribeModal = () => {
  // ------------------------------------------------------------ State --

  const { cardClasses } = useCardStyle()
  const { commonClasses } = useCommonStyle()

  const [isOpen, setIsOpen] = useState(false)
  const [planType, setPlanType] = useState<number>(constants.User.Type.Pro)

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
    <Modal
      open={isOpen}
      onOpen={handleOpenModal}
      onClose={handleCloseModal}
      trigger={(
        <Button color='blue'>
          {localeTool.t('common.subscribe')}
        </Button>
      )}
    >
      <Modal.Header>
        {localeTool.t('setting.selectPlan')}
      </Modal.Header>
      <Modal.Content>
        <Card.Group className={commonClasses.rowAround}>
          <Card
            className={classNames(
              [commonClasses.cursorClickable],
              { [cardClasses.isActive]: selectedProType },
            )}
            onClick={() => handleSelectType(constants.User.Type.Pro)}
          >
            <CardContent>
              <CardHeader>
                <h4>{commonEnum.Plan.Pro.Title}</h4>
              </CardHeader>
              <CardDescription>
                <h5><b>{commonEnum.Plan.Pro.Price}</b></h5>
                {commonEnum.Plan.Pro.Services.map((service) => (
                  <h5 key={service}>{service}</h5>
                ))}
                {selectedProType && (
                  <SubscribeButton
                    planType={constants.User.Type.Pro}
                    onCloseModal={handleCloseModal}
                  />
                )}
              </CardDescription>
            </CardContent>
          </Card>
          <Card
            className={classNames(
              [commonClasses.cursorClickable],
              { [cardClasses.isActive]: selectedPremiumType },
            )}
            onClick={() => handleSelectType(constants.User.Type.Premium)}
          >
            <CardContent>
              <CardHeader>
                <h4>{commonEnum.Plan.Premium.Title}</h4>
              </CardHeader>
              <CardDescription>
                <h5><b>{commonEnum.Plan.Premium.Price}</b></h5>
                {commonEnum.Plan.Premium.Services.map((service) => (
                  <h5 key={service}>{service}</h5>
                ))}
                {selectedPremiumType && (
                  <SubscribeButton
                    planType={constants.User.Type.Premium}
                    onCloseModal={handleCloseModal}
                  />
                )}
              </CardDescription>
            </CardContent>
          </Card>
        </Card.Group>
      </Modal.Content>
      <Modal.Actions>
        <Button color='grey' onClick={handleCloseModal}>
          {localeTool.t('common.close')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default SubscribeModal
