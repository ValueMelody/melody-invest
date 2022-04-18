import * as interfaces from '@shared/interfaces'
import useTraderState from '../../../states/useTraderState'
import usePageStyles from '../../hooks/usePageStyles'
import * as commonEnum from '../../../enums/common'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import ProfileCard from '../blocks/ProfileCard'
import VariationList from '../elements/VariationList'

const TopProfiles = () => {
  const { classes: pageClasses } = usePageStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const { getTopProfiles, getProfileDetail, fetchTopProfiles } = useTraderState()
  const [focusType, setFocusType] = vendorTool.react.useState('YEARLY')

  const topProfiles = getTopProfiles(commonEnum.OVERALL_ENV_ID)

  const topOptions = [
    {
      value: 'YEARLY',
      label: localeTool.t('bestReturn.yearlyTitle'),
      traders: topProfiles?.yearly || [],
      onClick: () => setFocusType('YEARLY'),
    },
    {
      value: 'PAST_YEAR',
      label: localeTool.t('bestReturn.pastYearTitle'),
      traders: topProfiles?.pastYear || [],
      onClick: () => setFocusType('PAST_YEAR'),
    },
    {
      value: 'PAST_QUARTER',
      label: localeTool.t('bestReturn.pastQuarterTitle'),
      traders: topProfiles?.pastQuarter || [],
      onClick: () => setFocusType('PAST_QUARTER'),
    },
    {
      value: 'PAST_MONTH',
      label: localeTool.t('bestReturn.pastMonthTitle'),
      traders: topProfiles?.pastMonth || [],
      onClick: () => setFocusType('PAST_MONTH'),
    },
    {
      value: 'PAST_WEEK',
      label: localeTool.t('bestReturn.pastWeekTitle'),
      traders: topProfiles?.pastWeek || [],
      onClick: () => setFocusType('PAST_WEEK'),
    },
  ]

  const focusedTop = topOptions.find((option) => option.value === focusType)

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (topProfiles) return
    fetchTopProfiles(commonEnum.OVERALL_ENV_ID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topProfiles])

  // ------------------------------------------------------------ Handler --

  const handleClickProfile = (
    trader: interfaces.traderModel.Record,
  ) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ Interface --

  if (!topProfiles || !focusedTop) return null

  return (
    <section className={pageClasses.root}>
      <section className={pageClasses.main}>
        <section className='row-start'>
          {focusedTop.traders.map((traderId) => (
            <div key={traderId}>
              <ProfileCard
                profile={getProfileDetail(traderId)}
                onClick={handleClickProfile}
                focusType={focusType}
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
