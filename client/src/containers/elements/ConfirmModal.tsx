import { ReactNode } from 'react'
import { Modal, Button } from 'semantic-ui-react'
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
      open={isOpen}
      onClose={handleCloseModal}
    >
      <Modal.Header>
        {title}
      </Modal.Header>
      <Modal.Content>
        {children}
      </Modal.Content>
      <Modal.Actions>
        <Button color='grey' onClick={handleCloseModal}>
          {localeTool.t('common.close')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ConfirmModal
