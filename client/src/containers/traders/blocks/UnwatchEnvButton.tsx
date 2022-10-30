import { useState } from 'react'
import { Button } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import WatchButton from '../elements/WatchButton'
import useTraderRequest from 'requests/useTraderRequest'
import ConfirmModal from 'containers/elements/ConfirmModal'

const UnwatchEnvButton = ({
  traderEnv,
}: {
  traderEnv: interfaces.traderEnvModel.Record,
}) => {
  const { deleteTraderEnv } = useTraderRequest()

  const [isDeleting, setIsDeleting] = useState(false)

  const handleClickUnwatch = () => {
    setIsDeleting(true)
  }

  const handleConfirmUnwatch = async () => {
    await deleteTraderEnv(traderEnv.id)
  }

  const handleCancelUnwatch = () => {
    setIsDeleting(false)
  }

  return (
    <>
      <ConfirmModal
        title={localeTool.t('unwatchEnv.title')}
        isOpen={isDeleting}
        onClose={handleCancelUnwatch}
      >
        <h4>{localeTool.t('unwatchEnv.desc')}</h4>
        <Button
          onClick={handleConfirmUnwatch}
          className='mt-2'
        >
          {localeTool.t('common.confirm')}
        </Button>
      </ConfirmModal>
      <WatchButton
        isWatched
        onToggle={handleClickUnwatch}
      />
    </>
  )
}

export default UnwatchEnvButton