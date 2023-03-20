import * as localeTool from 'tools/locale'
import { CheckIcon } from '@heroicons/react/24/solid'

const ProfileBuilderHeader = ({
  title,
  activeCount,
  isValid,
  invalidMessage,
}: {
  title: string;
  activeCount: number;
  isValid: boolean;
  invalidMessage: string;
}) => {
  return (
    <header
      data-testid='profileBuilderHeader'
      className='cursor-pointer flex items-center'
    >
      <h3 className='font-semibold mr-4'>
        {title}
      </h3>
      <h5 className='mr-4'>
        {localeTool.t('profileBuilder.numSelected', { num: activeCount })}
      </h5>
      {isValid && <CheckIcon
        color='green'
        className='icon-size'
                  />}
      {!isValid && <h5 className='text-red-600'>* {invalidMessage}</h5>}
    </header>
  )
}

export default ProfileBuilderHeader
