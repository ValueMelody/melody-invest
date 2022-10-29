import { CheckIcon } from '@heroicons/react/24/solid'
import * as localeTool from 'tools/locale'

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
      className='cursor-pointer flex items-center'
    >
      <h3 className='font-semibold mr-4'>
        {title}
      </h3>
      <h5 className='mr-4'>
        {localeTool.t('common.numSelected', { num: activeCount })}
      </h5>
      {isValid && <CheckIcon color='green' className='w-4 h-4' />}
      {!isValid && <h5 className='text-red-600'>* {invalidMessage}</h5>}
    </header>
  )
}

export default ProfileBuilderHeader
