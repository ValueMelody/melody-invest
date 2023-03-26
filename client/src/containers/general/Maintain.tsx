import * as localeTool from 'tools/locale'

const Maintain = () => {
  return (
    <section
      data-testid='maintain'
      className='bg-blue-600 p-8 rounded'
    >
      <h2
        className='text-white text-2xl'
        dangerouslySetInnerHTML={{
          __html: localeTool.t('page.maintaining'),
        }}
      />
    </section>
  )
}

export default Maintain
