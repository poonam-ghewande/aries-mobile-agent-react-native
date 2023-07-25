import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'

import Button, { ButtonType } from '../components/buttons/Button'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'

interface PhraseData {
  id: number
  value: string
}

const Passphrase: React.FC = () => {
  const { ColorPallet, TextTheme } = useTheme()
  const navigation = useNavigation()
  const [phraseData, setPhraseData] = useState<PhraseData[]>([
    { id: 1, value: 'abandon' },
    { id: 2, value: 'ability' },
    { id: 3, value: 'able' },
    { id: 4, value: 'about' },
    { id: 5, value: 'above' },
    { id: 6, value: 'absurd' },
    { id: 7, value: 'abuse' },
    { id: 8, value: 'absorb' },
  ])
  const screen = Dimensions.get('screen')

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: screen.height,
      flex: 1,
    },
    subcontainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: '30%',
    },
    rowContainerInternalView: {
      flexDirection: 'row',
      width: 150,
      margin: 10,
      padding: 7,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1.3,
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
    rowContainerView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    mediumTextStyle: {
      fontSize: 18,
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
    textStyle: {
      width: 20,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    containerView: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 10,
    },
    titleText: {
      fontSize: 26,
      marginTop: 15,
      textAlign: 'center',
    },
    detailText: {
      fontSize: 18,
      marginHorizontal: 30,
      marginTop: 20,
      lineHeight: 20,
      textAlign: 'center',
    },
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View>
          <Text style={[TextTheme.title, styles.titleText]}>Write down your seed phrase</Text>
          <Text style={[TextTheme.label, styles.detailText]}>
            This is your seed phrase. Write it down on a paper and keep it in a safe place. You'll be asked to re-enter
            this phrase (in order) on the next step.
          </Text>
        </View>
      </View>
      <View style={styles.subcontainer}>
        {phraseData.map((item: PhraseData) => (
          <TouchableOpacity key={item.id}>
            <View style={styles.rowContainerView}>
              <View
                style={[
                  styles.rowContainerInternalView,
                  {
                    borderStyle: 'dashed',
                    borderColor: ColorPallet.brand.primary,
                  },
                ]}
              >
                <Text style={[TextTheme.labelSubtitle, styles.mediumTextStyle]}>{item.value}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginTop: 'auto', margin: 20, alignItems: 'stretch' }}>
        <Button
          title={'Continue'}
          accessibilityLabel={'Okay'}
          buttonType={ButtonType.Primary}
          onPress={() => navigation.navigate(Screens.PassphraseVerify as never)}
        />
      </View>
    </ScrollView>
  )
}

export default Passphrase
