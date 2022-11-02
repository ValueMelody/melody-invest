import { useState } from 'react'
import { Button } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import WatchButton from '../elements/WatchButton'
import ConfirmModal from 'containers/elements/ConfirmModal'
import { useDispatch } from 'react-redux'
import * as actions from 'actions'

const UnwatchEnvButton = ({
  traderEnv,
}: {
  traderEnv: interfaces.traderEnvModel.Record,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [isDeleting, setIsDeleting] = useState(false)

  const handleClickUnwatch = () => {
    setIsDeleting(true)
  }

  const handleConfirmUnwatch = () => {
    dispatch(actions.deleteTraderEnv(traderEnv.id))
      .then(() => {
        const link = routerTool.dashboardRoute()
        navigate(link)
      })
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
