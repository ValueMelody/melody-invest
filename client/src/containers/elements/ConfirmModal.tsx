import * as localeTool from 'tools/locale'
import { Button, Modal } from 'flowbite-react'
import { ReactNode } from 'react'

const ConfirmModal = ({
  title,
  children,
  isOpen,
  onClose,
}: {
  title: string;
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const handleCloseModal = () => {
    onClose()
  }

  return (
    <Modal
      data-testid='confirmModal'
      show={isOpen}
      onClose={handleCloseModal}
    >
      <Modal.Header>
        {title}
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer className='flex justify-end'>
        <Button
          color='gray'
          onClick={handleCloseModal}
        >
          {localeTool.t('common.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
