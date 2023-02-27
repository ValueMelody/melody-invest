import * as interfaces from '@shared/interfaces'
import * as traderAction from 'actions/trader'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import UnwatchEnvButton from './UnwatchEnvButton'
import { createAsyncThunk } from '@reduxjs/toolkit'

const envType = mock<interfaces.traderEnvModel.Record>({})

jest.mock('actions/trader', () => {
  const actual = jest.requireActual('actions/trader')
  return {
    __esModule: true,
    ...actual,
  }
})

const deleteEnv = jest.fn()
jest.spyOn(traderAction, 'deleteTraderEnv')
  .mockImplementation(createAsyncThunk(
    'test/deleteTraderEnv',
    deleteEnv,
  ))

describe('#UnwatchEnvButton', () => {
  test('could trigger unwatch', async () => {
    render(
      <UnwatchEnvButton
        traderEnv={{
          ...instance(envType),
          id: 2,
        }}
      />,
    )
    fireEvent.click(screen.getByTestId('watchButton'))
    expect(screen.queryByTestId('confirmModal')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('confirmModalCloseBtn'))
    expect(screen.queryByTestId('confirmModal')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('watchButton'))
    await act(() => {
      fireEvent.click(screen.getByTestId('confirmUnwatchBtn'))
    })
    expect(deleteEnv).toBeCalledWith(2, expect.any(Object))
  })
})
