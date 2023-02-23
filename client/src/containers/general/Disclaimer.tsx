import * as localeTool from 'tools/locale'
import { Textarea } from 'flowbite-react'

const Disclaimer = () => {
  return (
    <section className='flex flex-col items-center'>
      <h1 className='font-bold text-2xl mb-6'>
        {localeTool.t('common.disclaimer')}
      </h1>
      <section className='p-8 w-full'>
        <Textarea
          data-testid='privacy-content'
          style={{ height: 'calc(100vh - 300px)', minHeight: 300 }}
          disabled
          value={String(localeTool.t('page.disclaimer'))}
        />
      </section>
    </section>
  )
}

export default Disclaimer
