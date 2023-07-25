import { render } from '@testing-library/react-native'
import React from 'react'

import ExportWalletConfirmation from '../../App/screens/ExportWalletConfirmation'
import renderer from 'react-test-renderer'
// import { testIdWithKey } from '../../App/utils/testable'

jest.mock('@react-navigation/core', () => {
  return require('../../__mocks__/custom/@react-navigation/core')
})
jest.mock('@react-navigation/native', () => {
  return require('../../__mocks__/custom/@react-navigation/native')
})
describe('Export wallet screen', () => {
  beforeEach(() => {
    // Silence console.error because it will print a warning about Switch
    // "Warning: dispatchCommand was called with a ref ...".
    jest.spyOn(console, 'error').mockImplementation(() => {
      return null
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('screen renders correctly', () => {
    const tree = render(<ExportWalletConfirmation />).toJSON()
    console.log('tree', tree)
    expect(tree).toMatchSnapshot()
  })
})
