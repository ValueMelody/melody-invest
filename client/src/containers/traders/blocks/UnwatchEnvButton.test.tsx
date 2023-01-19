import * as interfaces from '@shared/interfaces'
import { act, fireEvent, render, screen } from 'test.utils'
import UnwatchEnvButton from './UnwatchEnvButton'
import { instance, mock } from 'ts-mockito'
import * as traderAction from 'actions/trader'
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
    await act(() => {
      fireEvent.click(screen.getByTestId('confirmUnwatchBtn'))
    })
    expect(deleteEnv).toBeCalledWith(2, expect.any(Object))
  })
})
