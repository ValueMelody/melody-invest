import * as interfaces from '@shared/interfaces'
import useTraderState from '../../../states/useTraderState'
import usePageStyles from '../../hooks/usePageStyles'
import * as commonEnum from '../../../enums/common'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import TraderProfileCard from '../blocks/TraderProfileCard'
import VariationList from '../elements/VariationList'

const TopProfiles = () => {
  const { classes: pageClasses } = usePageStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const { getTopTraderProfiles, getTraderProfile } = useTraderState()
  const [focusType, setFocusType] = vendorTool.react.useState('YEARLY')

  const topTraderProfiles = getTopTraderProfiles(commonEnum.Config.OverallEnvId)

  const topOptions = [
    {
      value: 'YEARLY',
      label: localeTool.t('bestReturn.yearlyTitle'),
      traders: topTraderProfiles?.yearly || [],
      onClick: () => setFocusType('YEARLY'),
    },
    {
      value: 'PAST_YEAR',
      label: localeTool.t('bestReturn.pastYearTitle'),
      traders: topTraderProfiles?.pastYear || [],
      onClick: () => setFocusType('PAST_YEAR'),
    },
    {
      value: 'PAST_QUARTER',
      label: localeTool.t('bestReturn.pastQuarterTitle'),
      traders: topTraderProfiles?.pastQuarter || [],
      onClick: () => setFocusType('PAST_QUARTER'),
    },
    {
      value: 'PAST_MONTH',
      label: localeTool.t('bestReturn.pastMonthTitle'),
      traders: topTraderProfiles?.pastMonth || [],
      onClick: () => setFocusType('PAST_MONTH'),
    },
    {
      value: 'PAST_WEEK',
      label: localeTool.t('bestReturn.pastWeekTitle'),
      traders: topTraderProfiles?.pastWeek || [],
      onClick: () => setFocusType('PAST_WEEK'),
    },
  ]

  const focusedTop = topOptions.find((option) => option.value === focusType)

  // ------------------------------------------------------------ Handler --

  const handleClickProfile = (
    trader: interfaces.traderModel.Record,
  ) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ UI --

  if (!topTraderProfiles || !focusedTop) return null

  return (
    <section className={pageClasses.root}>
      <section className={pageClasses.main}>
        <section className='row-start'>
          {focusedTop.traders.map((traderId) => (
            <div key={traderId}>
              <TraderProfileCard
                profile={getTraderProfile(traderId)}
                onClick={handleClickProfile}
              />
            </div>
          ))}
        </section>
      </section>
      <aside className={pageClasses.aside}>
        <h2>{localeTool.t('bestReturn.type')}:</h2>
        <VariationList
          options={topOptions}
          activeValue={focusType}
        />
      </aside>
    </section>
  )
}

export default TopProfiles
