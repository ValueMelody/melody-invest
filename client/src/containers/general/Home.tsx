import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import {
  ArrowRightIcon, BookmarkIcon, ChartBarIcon,
  PuzzlePieceIcon, SparklesIcon, StarIcon,
} from '@heroicons/react/24/solid'
import { Badge, Button, Card } from 'flowbite-react'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const Section = ({
  title,
  desc,
  Icon,
}: {
  title: string;
  desc: string;
  Icon: FC<{ className: string }>;
}) => {
  return (
    <Card className='flex flex-col w-60 m-2'>
      <header className='flex items-center justify-center mb-4'>
        <Icon className='w-6 h-6' />
        <h2 className='font-semibold ml-4'>{title}</h2>
      </header>
      <h4>{desc}</h4>
    </Card>
  )
}

const Home = () => {
  const navigate = useNavigate()

  const handleClickSignUp = () => {
    navigate(routerTool.signUpRoute())
  }

  const handleClickBehaviors = () => {
    navigate(routerTool.behaviorListRoute())
  }

  const handleClickStocks = () => {
    navigate(routerTool.tickerListRoute())
  }

  return (
    <section className='flex flex-wrap justify-around p-8 rounded bg-gradient-to-br from-purple-600 to-blue-600'>
      <section className='flex flex-col'>
        <section className='flex  max-lg:justify-center'>
          <Badge>
            {localeTool.t('home.coreConcepts')}
          </Badge>
        </section>
        <section className='flex flex-wrap  max-lg:justify-center'>
          <Section
            title={localeTool.t('common.traderEnv')}
            desc={localeTool.t('home.traderEnvDefine')}
            Icon={BookmarkIcon}
          />
          <Section
            title={localeTool.t('common.traderProfile')}
            desc={localeTool.t('home.traderProfileInit')}
            Icon={StarIcon}
          />
          <Section
            title={localeTool.t('common.traderCombo')}
            desc={localeTool.t('home.traderPerformanceCombo')}
            Icon={PuzzlePieceIcon}
          />
        </section>
        <section className='flex mt-4  max-lg:justify-center'>
          <Badge>
            {localeTool.t('home.centralOutputs')}
          </Badge>
        </section>
        <section className='flex flex-wrap  max-lg:justify-center'>
          <Section
            title={localeTool.t('home.performancePrediction')}
            desc={localeTool.t('home.traderPerformanceList')}
            Icon={ChartBarIcon}
          />
          <Section
            title={localeTool.t('home.strategyEvolution')}
            desc={localeTool.t('home.traderProfileEvolve')}
            Icon={SparklesIcon}
          />
        </section>
      </section>
      <section className='flex flex-col justify-center items-center ml-8'>
        <h1 className='text-xl font-semibold text-slate-200 mb-4'>
          {localeTool.t('home.header')}
        </h1>
        <Button
          color='gray'
          onClick={handleClickSignUp}
        >
          {localeTool.t('home.signUpBtn')}
          <ArrowRightIcon className='icon-size ml-2' />
        </Button>
        <Button
          color='gray'
          className='my-4'
          onClick={handleClickBehaviors}
        >
          {localeTool.t('home.checkBehaviorsBtn')}
          <ArrowRightIcon className='icon-size ml-2' />
        </Button>
        <Button
          color='gray'
          onClick={handleClickStocks}
        >
          {localeTool.t('home.checkTickersBtn')}
          <ArrowRightIcon className='icon-size ml-2' />
        </Button>
      </section>
    </section>
  )
}

export default Home
