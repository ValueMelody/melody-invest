import { useState } from 'react'
import { Button } from 'flowbite-react'
import * as localeTool from 'tools/locale'
import ConfirmModal from 'containers/elements/ConfirmModal'
import { useDispatch } from 'react-redux'
import * as actions from 'actions'

const UnsubscribeButton = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleConfirmUnsubscribe = () => {
    dispatch(actions.cancelUserSubscription())
      .then((res: any) => {
        if (!res.error) dispatch(actions.fetchUserOverall())
        handleCloseModal()
      })
  }

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
