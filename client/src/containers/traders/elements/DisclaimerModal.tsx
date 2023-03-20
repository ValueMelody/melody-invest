import * as actions from 'actions'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { Button, Modal } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const DisclaimerModal = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { acceptedDisclaimer } = useSelector(selectors.selectGlobal())

  const handleAccept = () => {
    dispatch(actions.acceptDisclaimer())
  }

  const handleReject = () => {
    navigate(routerTool.rootRoute())
  }

  return (
    <Modal
      show={!acceptedDisclaimer}
      onClose={handleReject}
      className='bg-opacity-95'
    >
      <Modal.Header>
        {localeTool.t('page.disclaimer')}
      </Modal.Header>
      <Modal.Body>
        <section
          className='overflow-y-auto h-60'
          dangerouslySetInnerHTML={{ __html: localeTool.t('content.disclaimer') }}
        />
      </Modal.Body>
      <Modal.Footer className='flex justify-between'>
        <Button
          onClick={handleAccept}
        >
          {localeTool.t('disclaimerModal.confirmBtn')}
        </Button>
        <Button
          color='failure'
          onClick={handleReject}
        >
          {localeTool.t('disclaimerModal.cancelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DisclaimerModal
