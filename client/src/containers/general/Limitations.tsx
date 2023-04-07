import * as localeTool from 'tools/locale'

const Limitations = () => {
  return (
    <section className='flex flex-col items-center'>
      <h1 className='font-bold text-2xl mb-6'>
        {localeTool.t('page.limitations')}
      </h1>
      <section
        className='px-8 w-full'
        dangerouslySetInnerHTML={{
          __html: localeTool.t('content.limitations', {
            drawback: localeTool.t('content.drawback'),
          }),
        }}
      />
    </section>
  )
}

export default Limitations
