import { Segment, Label } from 'semantic-ui-react'
import * as constants from '@shared/constants'
import * as localeTool from '../../tools/locale'

const ProfileBuild = () => {
  return (
    <div>
      <h3>{localeTool.t('profileBuild.title')}</h3>
      <Segment.Group>
        <Segment>
          <h4>{localeTool.t('profileBuild.buyBehavior')}</h4>
          <div>
            {constants.behavior.buyBehaviors.map((buyBehavior) => (
              <Label key={buyBehavior}>{buyBehavior}</Label>
            ))}
          </div>
        </Segment>
        <Segment>
          <h4>{localeTool.t('profileBuild.sellBehavior')}</h4>
        </Segment>
      </Segment.Group>
    </div>
  )
}

export default ProfileBuild
