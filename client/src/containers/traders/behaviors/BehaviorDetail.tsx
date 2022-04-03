import * as constants from '@shared/constants'
import { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { useParams, useNavigate } from 'react-router-dom'
import * as parseTool from '../../../tools/parse'
import * as routerEnum from '../../../enums/router'
import BehaviorLabel from '../elements/BehaviorLabel'

const useStyles = createUseStyles(({
  container: {
    alignItems: 'flex-start',
  },
  desc: {
    marginLeft: '1rem !important',
  },
}))

const BehaviorDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const behavior = params.behavior || null
  const validBehavior = constants.behavior.behaviors.find((value) => value === behavior) || null

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!validBehavior) navigate(routerEnum.NAV.NOT_FOUND)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ------------------------------------------------------------ Interface --

  if (!validBehavior) return null

  return (
    <section className={classNames('row-between', classes.container)}>
      <header className='row-start'>
        <BehaviorLabel behavior={validBehavior} color='blue' />
        <h4 className={classes.desc}>
          {parseTool.behaviorDesc(validBehavior)}
        </h4>
      </header>
      <section></section>
    </section>
  )
}

export default BehaviorDetail
