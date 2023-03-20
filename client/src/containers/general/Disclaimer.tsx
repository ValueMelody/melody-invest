import * as localeTool from 'tools/locale'

const Disclaimer = () => {
  return (
    <section className='flex flex-col items-center'>
      <h1 className='font-bold text-2xl mb-6'>
        {localeTool.t('page.disclaimer')}
      </h1>
      <section
        className='px-8 w-full'
        dangerouslySetInnerHTML={{ __html: localeTool.t('content.disclaimer') }}
      />
    </section>
  )
}

export default Disclaimer
