import { render } from '@testing-library/react-native'
import React from 'react'

import ExportWallet from '../../App/screens/ExportWallet'
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
    const tree = render(<ExportWallet />).toJSON()
    console.log('tree', tree)
    expect(tree).toMatchSnapshot()
  })

  // const navigation = {
  //   navigate: jest.fn(),
  //   goBack: jest.fn(),
  //   // Add other methods that your component uses if necessary
  // }

  // Your test case

  //   test('pressables exist', async () => {
  //     const { findByTestId } = render(<Developer />)

  //     const VerifierToggle = await findByTestId(testIdWithKey('ToggleVerifierCapability'))
  //     const ConnectionToggle = await findByTestId(testIdWithKey('ToggleConnectionInviterCapabilitySwitch'))
  //     const DevVerifierToggle = await findByTestId(testIdWithKey('ToggleDevVerifierTemplatesSwitch'))

  //     expect(VerifierToggle).not.toBe(null)
  //     expect(ConnectionToggle).not.toBe(null)
  //     expect(DevVerifierToggle).not.toBe(null)
  //   })
})
