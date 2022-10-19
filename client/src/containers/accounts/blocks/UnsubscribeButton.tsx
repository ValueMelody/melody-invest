import * as localeTool from 'tools/locale'
import * as vendorTool from 'tools/vendor'
import useUserRequest from 'requests/useUserRequest'
import ConfirmModal from 'containers/elements/ConfirmModal'

const UnsubscribeButton = () => {
  // ------------------------------------------------------------ State --

  const { cancelUserSubscription, fetchUserOverall } = useUserRequest()

  const [showModal, setShowModal] = vendorTool.react.useState(false)

  // ------------------------------------------------------------ State --

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleConfirmUnsubscribe = async () => {
    await cancelUserSubscription()
    await fetchUserOverall()
    handleCloseModal()
  }

  // ------------------------------------------------------------ UI --

  return (
    <>
      <ConfirmModal
        title={localeTool.t('common.unsubscribe')}
        isOpen={showModal}
        onClose={handleCloseModal}
      >
        <h4>{localeTool.t('setting.unsubscribeDesc')}</h4>
        <vendorTool.ui.Button
          color='blue'
          className='mt-2'
          onClick={handleConfirmUnsubscribe}
        >
          {localeTool.t('common.confirm')}
        </vendorTool.ui.Button>
      </ConfirmModal>
      <vendorTool.ui.Button
        className='mt-2'
        onClick={handleOpenModal}
      >
        {localeTool.t('common.unsubscribe')}
      </vendorTool.ui.Button>
    </>
  )
}

export default UnsubscribeButton
