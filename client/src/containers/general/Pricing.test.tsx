import { screen, render } from 'test.utils'
import Pricing from './Pricing'
import * as commonEnum from 'enums/common'

describe('#Pricing', () => {
  test('could render pricing', () => {
    render(<Pricing />)

    Object.values(commonEnum.Plan).forEach((plan) => {
      expect(screen.getByText(plan.Title)).toBeTruthy()
      expect(screen.getByText(plan.Price)).toBeTruthy()
      plan.Services.forEach((service) => {
        expect(screen.getByText(service)).toBeTruthy()
      })
    })
  })
})
