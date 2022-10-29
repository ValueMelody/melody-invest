const RequiredLabel = ({
  title,
}: {
  title: string;
}) => {
  return (
    <h5 data-testid='requiredLabel'>
      <b>
        {title}&nbsp;
        <span className='text-red-600'>*</span>
      </b>
    </h5>
  )
}

export default RequiredLabel
