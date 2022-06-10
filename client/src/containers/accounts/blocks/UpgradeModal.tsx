import * as constants from '@shared/constants'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import { Theme } from '../../../enums/theme'
import * as commonEnum from '../../../enums/common'
import SubscribeButton from './SubscribeButton'

const useStyles = vendorTool.jss.createUseStyles((theme: Theme) => ({
  selected: {
    border: `2px solid ${theme.PrimaryColor} !important`,
  },
}))

const UpgradeModal = () => {
  // ------------------------------------------------------------ State --

  const classes = useStyles()
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
          {localeTool.t('common.upgrade')}
        </vendorTool.ui.Button>
      )}
    >
      <vendorTool.ui.Modal.Header>
        {localeTool.t('setting.selectPlan')}
      </vendorTool.ui.Modal.Header>
      <vendorTool.ui.Modal.Content>
        <vendorTool.ui.Card.Group className='row-around'>
          <vendorTool.ui.Card
            className={vendorTool.classNames('click-cursor', {
              [classes.selected]: selectedProType,
            })}
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
            className={vendorTool.classNames('click-cursor', {
              [classes.selected]: selectedPremiumType,
            })}
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

export default UpgradeModal
