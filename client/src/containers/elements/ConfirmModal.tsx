import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'

const ConfirmModal = ({
  title,
  children,
  isOpen,
  onClose,
}: {
  title: string;
  children?: vendorTool.react.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // ------------------------------------------------------------ Handler --

  const handleCloseModal = () => {
    onClose()
  }

  // ------------------------------------------------------------ UI --

  return (
    <vendorTool.ui.Modal
      data-testid='confirmModal'
      open={isOpen}
      onClose={handleCloseModal}
    >
      <vendorTool.ui.Modal.Header>
        {title}
      </vendorTool.ui.Modal.Header>
      <vendorTool.ui.Modal.Content>
        {children}
      </vendorTool.ui.Modal.Content>
      <vendorTool.ui.Modal.Actions>
        <vendorTool.ui.Button color='grey' onClick={handleCloseModal}>
          {localeTool.t('common.close')}
        </vendorTool.ui.Button>
      </vendorTool.ui.Modal.Actions>
    </vendorTool.ui.Modal>
  )
}

export default ConfirmModal
