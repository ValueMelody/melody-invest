import * as localeTool from 'tools/locale'

const Maintain = () => {
  return (
    <section className='bg-blue-600 p-8 rounded'>
      <h2 className='text-white text-2xl'>
        {localeTool.t('page.maintaining')}
      </h2>
    </section>
  )
}

export default Maintain
