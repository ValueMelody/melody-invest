import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import { Button } from 'flowbite-react'
import ConfirmModal from 'containers/elements/ConfirmModal'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import WatchButton from '../elements/WatchButton'

const UnwatchEnvButton = ({
  traderEnv,
}: {
  traderEnv: interfaces.traderEnvModel.Record;
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [isDeleting, setIsDeleting] = useState(false)

  const handleClickUnwatch = () => {
    setIsDeleting(true)
  }

  const handleConfirmUnwatch = () => {
    dispatch(actions.deleteTraderEnv(traderEnv.id))
      .then((res: any) => {
        if (!res.error) navigate(routerTool.dashboardRoute())
      })
  }

  const handleCancelUnwatch = () => {
    setIsDeleting(false)
  }

  return (
    <>
      <ConfirmModal
        title={localeTool.t('unwatchEnvModal.title')}
        isOpen={isDeleting}
        onClose={handleCancelUnwatch}
      >
        <h4>{localeTool.t('unwatchEnvModal.desc')}</h4>
        <Button
          data-testid='confirmUnwatchBtn'
          onClick={handleConfirmUnwatch}
          className='mt-2'
        >
          {localeTool.t('unwatchEnvModal.confirm')}
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
