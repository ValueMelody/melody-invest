import * as commonEnum from 'enums/common'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

const Header = ({
  title,
  className,
}: {
  title: string,
  className: string,
}) => {
  return (
    <header
      className={classNames('text-white w-full text-center p-4 rounded', className)}
    >
      <h2>{title}</h2>
    </header>
  )
}

const Price = ({
  title,
}: {
  title: string,
}) => {
  return (
    <div className='bg-gray-300 w-full p-4'>
      <h3 className='text-center'>
        {title}
      </h3>
    </div>
  )
}

const Item = ({
  title,
}: {
  title: string,
}) => {
  return (
    <div className='w-full text-center p-4'>
      <h4>{title}</h4>
    </div>
  )
}

const sectionClass = 'flex flex-col items-center w-96'

const Pricing = () => {
  return (
    <section className='flex flex-col items-center'>
      <h1 className='font-bold text-2xl mb-6'>
        {localeTool.t('pricing.title')}
      </h1>
      <section className='flex justify-around w-full'>
        <section className={sectionClass}>
          <Header
            title={commonEnum.Plan.Basic.Title}
            className='bg-slate-600'
          />
          <Price title={commonEnum.Plan.Basic.Price} />
          {commonEnum.Plan.Basic.Services.map((service) => (
            <Item
              key={service}
              title={service}
            />
          ))}
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <div className='w-full bg-slate-100 flex justify-center p-4'>
            <Link
              to={routerTool.signUpRoute()}
              className='bg-primary text-white rounded px-4 py-2'
            >
              {localeTool.t('common.signUp')}
            </Link>
          </div>
        </section>
        <section className={sectionClass}>
          <Header
            title={commonEnum.Plan.Pro.Title}
            className='bg-primary'
          />
          <Price title={commonEnum.Plan.Pro.Price} />
          {commonEnum.Plan.Pro.Services.map((service) => (
            <Item
              key={service}
              title={service}
            />
          ))}
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
        </section>
        <section className={sectionClass}>
          <Header
            title={commonEnum.Plan.Premium.Title}
            className='bg-green-600'
          />
          <Price title={commonEnum.Plan.Premium.Price} />
          {commonEnum.Plan.Premium.Services.map((service) => (
            <Item
              key={service}
              title={service}
            />
          ))}
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
          <Item title='' />
        </section>
      </section>
    </section>
  )
}

export default Pricing
