import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import { fireEvent, render, screen } from 'test.utils'
import PaymentModal from './PaymentModal'

describe('#PaymentModal', () => {
  test('could render options for basic user', () => {
    render(<PaymentModal userType={1} />)

    expect(screen.queryByTestId('paymentModal')).not.toBeInTheDocument()
    const upgradeBtn = screen.getByTestId('upgradeBtn')
    expect(upgradeBtn.innerHTML).toContain(localeTool.t('common.upgrade'))

    fireEvent.click(upgradeBtn)
    expect(screen.queryByTestId('paymentModal')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('closeBtn'))
    expect(screen.queryByTestId('paymentModal')).not.toBeInTheDocument()

    fireEvent.click(upgradeBtn)
    expect(screen.getByTestId('proCard')).toBeInTheDocument()
    expect(screen.getByTestId('premiumCard')).toBeInTheDocument()

    expect(screen.queryByTestId('paymentOption-0')).not.toBeInTheDocument()
    fireEvent.change(screen.getByTestId('stateSelector'), { target: { value: 'Other' } })

    fireEvent.click(screen.getByTestId('proCard'))
    expect((screen.getByTestId('paymentOption-0') as HTMLInputElement).value).toBe(
      constants.User.PlanPrice.Pro.OneMonthPrice,
    )
    expect((screen.getByTestId('paymentOption-1') as HTMLInputElement).value).toBe(
      constants.User.PlanPrice.Pro.ThreeMonthsPrice,
    )
    expect((screen.getByTestId('paymentOption-2') as HTMLInputElement).value).toBe(
      constants.User.PlanPrice.Pro.SixMonthsPrice,
    )
    expect((screen.getByTestId('paymentOption-3') as HTMLInputElement).value).toBe(
      constants.User.PlanPrice.Pro.OneYearPrice,
    )

    fireEvent.click(screen.getByTestId('paymentOption-2'))
    expect(screen.queryByTestId('taxAmount')).not.toBeInTheDocument()
    expect(screen.queryByTestId('totalAmount')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('premiumCard'))
    fireEvent.change(screen.getByTestId('stateSelector'), { target: { value: 'CA' } })
    expect(screen.queryByTestId('paymentOption-0')).not.toBeInTheDocument()
    fireEvent.change(screen.getByTestId('provinceSelector'), { target: { value: 'ON' } })

    expect((screen.getByTestId('paymentOption-0') as HTMLInputElement).value).toBe(
      constants.User.PlanPrice.Premium.OneMonthPrice,
    )
    expect((screen.getByTestId('paymentOption-1') as HTMLInputElement).value).toBe(
      constants.User.PlanPrice.Premium.ThreeMonthsPrice,
    )
    expect((screen.getByTestId('paymentOption-2') as HTMLInputElement).value).toBe(
      constants.User.PlanPrice.Premium.SixMonthsPrice,
    )
    expect((screen.getByTestId('paymentOption-3') as HTMLInputElement).value).toBe(
      constants.User.PlanPrice.Premium.OneYearPrice,
    )

    fireEvent.click(screen.getByTestId('paymentOption-3'))
    expect(screen.getByTestId('taxAmount').innerHTML).toBe('26.00')
    expect(screen.getByTestId('totalAmount').innerHTML).toBe('225.99')

    fireEvent.click(screen.getByTestId('paymentOption-1'))
    expect(screen.getByTestId('taxAmount').innerHTML).toBe('7.28')
    expect(screen.getByTestId('totalAmount').innerHTML).toBe('63.27')

    fireEvent.change(screen.getByTestId('provinceSelector'), { target: { value: 'AB' } })
    expect(screen.getByTestId('taxAmount').innerHTML).toBe('2.80')
    expect(screen.getByTestId('totalAmount').innerHTML).toBe('58.79')
  })
})
