import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Keyboard, StyleSheet, Text, Image } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { SafeAreaView } from 'react-native-safe-area-context'

import Button, { ButtonType } from '../components/buttons/Button'
import PinInput from '../components/inputs/PinInput'
import { useTheme } from '../contexts/theme'
import { testIdWithKey } from '../utils/testable'

interface PinEnterProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const PinEnter: React.FC<PinEnterProps> = ({ setAuthenticated }) => {
  const { t } = useTranslation()
  const [pin, setPin] = useState('')

  const { ColorPallet, TextTheme, Assets } = useTheme()
  const style = StyleSheet.create({
    container: {
      backgroundColor: ColorPallet.brand.primaryBackground,
      margin: 20,
    },
  })

  const checkPin = async (pin: string) => {
    const keychainEntry = await Keychain.getGenericPassword({ service: 'passcode' })
    if (keychainEntry && JSON.stringify(pin) === keychainEntry.password) {
      setAuthenticated(true)
    } else {
      Alert.alert(t('PinEnter.IncorrectPin'))
    }
  }

  return (
    <SafeAreaView style={[style.container]}>
      <Image
        source={Assets.img.logoLarge.src}
        style={{
          height: Assets.img.logoLarge.height,
          width: Assets.img.logoLarge.width,
          resizeMode: Assets.img.logoLarge.resizeMode,
          alignSelf: 'center',
          marginBottom: 20,
        }}
      />
      <Text style={[TextTheme.normal, { alignSelf: 'center' }]}>Please enter your PIN</Text>
      <PinInput onPinChanged={setPin} />
      <Button
        title={t('Global.Submit')}
        buttonType={ButtonType.Primary}
        testID={testIdWithKey('Submit')}
        accessibilityLabel={t('Global.Submit')}
        onPress={() => {
          Keyboard.dismiss()
          checkPin(pin)
        }}
      />
    </SafeAreaView>
  )
}

export default PinEnter
