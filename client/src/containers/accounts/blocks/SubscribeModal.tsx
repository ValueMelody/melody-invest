import * as constants from '@shared/constants'
import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as commonEnum from 'enums/common'
import useCardStyle from 'styles/useCardStyle'
import useCommonStyle from 'styles/useCommonStyle'
import SubscribeButton from './SubscribeButton'

const SubscribeModal = () => {
  // ------------------------------------------------------------ State --

  const { cardClasses } = useCardStyle()
  const { commonClasses } = useCommonStyle()

  const [isOpen, setIsOpen] = vendorTool.react.useState(false)
  const [planType, setPlanType] = vendorTool.react.useState(constants.User.Type.Pro)

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
    <vendorTool.ui.Modal
      open={isOpen}
      onOpen={handleOpenModal}
      onClose={handleCloseModal}
      trigger={(
        <vendorTool.ui.Button color='blue'>
          {localeTool.t('common.subscribe')}
        </vendorTool.ui.Button>
      )}
    >
      <vendorTool.ui.Modal.Header>
        {localeTool.t('setting.selectPlan')}
      </vendorTool.ui.Modal.Header>
      <vendorTool.ui.Modal.Content>
        <vendorTool.ui.Card.Group className={commonClasses.rowAround}>
          <vendorTool.ui.Card
            className={vendorTool.classNames(
              [commonClasses.cursorClickable],
              { [cardClasses.isActive]: selectedProType },
            )}
            onClick={() => handleSelectType(constants.User.Type.Pro)}
          >
            <vendorTool.ui.CardContent>
              <vendorTool.ui.CardHeader>
                <h4>{commonEnum.Plan.Pro.Title}</h4>
              </vendorTool.ui.CardHeader>
              <vendorTool.ui.CardDescription>
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
              </vendorTool.ui.CardDescription>
            </vendorTool.ui.CardContent>
          </vendorTool.ui.Card>
          <vendorTool.ui.Card
            className={vendorTool.classNames(
              [commonClasses.cursorClickable],
              { [cardClasses.isActive]: selectedPremiumType },
            )}
            onClick={() => handleSelectType(constants.User.Type.Premium)}
          >
            <vendorTool.ui.CardContent>
              <vendorTool.ui.CardHeader>
                <h4>{commonEnum.Plan.Premium.Title}</h4>
              </vendorTool.ui.CardHeader>
              <vendorTool.ui.CardDescription>
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
              </vendorTool.ui.CardDescription>
            </vendorTool.ui.CardContent>
          </vendorTool.ui.Card>
        </vendorTool.ui.Card.Group>
      </vendorTool.ui.Modal.Content>
      <vendorTool.ui.Modal.Actions>
        <vendorTool.ui.Button color='grey' onClick={handleCloseModal}>
          {localeTool.t('common.close')}
        </vendorTool.ui.Button>
      </vendorTool.ui.Modal.Actions>
    </vendorTool.ui.Modal>
  )
}

export default SubscribeModal
