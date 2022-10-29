import Info from 'containers/elements/Info'
import classNames from 'classnames'

const RequiredLabel = ({
  title,
  className,
  tooltip,
}: {
  title: string;
  className?: string;
  tooltip?: string;
}) => {
  return (
    <h3
      data-testid='requiredLabel'
      className={classNames(className, 'font-semibold')}
    >
      {title}
      {tooltip && <Info title={tooltip} />}
      <span className='text-red-600'>*</span>
    </h3>
  )
}

export default RequiredLabel
