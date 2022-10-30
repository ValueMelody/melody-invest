import { ReactNode } from 'react'
import { Button, Modal } from 'flowbite-react'
import * as localeTool from 'tools/locale'

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
  // ------------------------------------------------------------ Handler --

  const handleCloseModal = () => {
    onClose()
  }

  // ------------------------------------------------------------ UI --

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
