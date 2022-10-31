import { useState } from 'react'
import { Button } from 'flowbite-react'
import * as localeTool from 'tools/locale'
import useUserRequest from 'requests/useUserRequest'
import ConfirmModal from 'containers/elements/ConfirmModal'
import { useDispatch } from 'react-redux'
import * as actions from 'actions'

const UnsubscribeButton = () => {
  // ------------------------------------------------------------ State --
  const dispatch = useDispatch<AppDispatch>()

  const { cancelUserSubscription } = useUserRequest()

  const [showModal, setShowModal] = useState(false)

  // ------------------------------------------------------------ State --

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleConfirmUnsubscribe = async () => {
    await cancelUserSubscription()
    dispatch(actions.fetchUserOverall())
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
        <Button
          className='mt-2'
          onClick={handleConfirmUnsubscribe}
        >
          {localeTool.t('common.confirm')}
        </Button>
      </ConfirmModal>
      <Button
        color='gray'
        className='mt-2'
        onClick={handleOpenModal}
      >
        {localeTool.t('common.unsubscribe')}
      </Button>
    </>
  )
}

export default UnsubscribeButton
