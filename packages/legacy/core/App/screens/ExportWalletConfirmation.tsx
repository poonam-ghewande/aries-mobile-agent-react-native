import { useAgent } from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/core'
import md5 from 'md5'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native'
// import RNFS from 'react-native-fs'
import Toast from 'react-native-toast-message'
import { zip } from 'react-native-zip-archive'
import RNFetchBlob from 'rn-fetch-blob'

import ButtonLoading from '../components/animated/ButtonLoading'
import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'
import { Encrypt768, keyGen768 } from '../utils/crystals-kyber'
interface PhraseData {
  id: number
  value: string
}

function ExportWalletConfirmation() {
  const { agent } = useAgent()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [phraseData, setPhraseData] = useState<PhraseData[]>([])
  const [arraySetPhraseData, setArraySetPhraseData] = useState<string[]>([])
  const [nextPhraseIndex, setNextPhraseIndex] = useState(0)
  const [matchPhrase, setMatchPhrase] = useState(false)
  const { ColorPallet, TextTheme } = useTheme()
  const { width } = Dimensions.get('window')

  const data: PhraseData[] = [
    { id: 1, value: 'abandon' },
    { id: 2, value: 'ability' },
    { id: 3, value: 'able' },
    { id: 4, value: 'about' },
    { id: 5, value: 'above' },
    { id: 6, value: 'absurd' },
    { id: 7, value: 'abuse' },
    { id: 8, value: 'absorb' },
  ]

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-around',
      height: '100%',
    },
    scrollview: {
      flex: 1,
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
    successText: {
      fontSize: 14,
    },
    successView: { justifyContent: 'center', alignItems: 'center' },
    setPhraseView: {
      width: width - 60,
      height: 1,
      marginBottom: 25,
      marginTop: 25,
    },
    addPhraseView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 10,
    },
    rowAddItemContainerView: {
      width: 150,
      marginVertical: 10,
      padding: 7,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowAddItemText: {
      fontSize: 20,
      color: '#fff',
    },
    rowItemIndexText: {
      width: 20,
      textAlign: 'center',
    },
    rowItemPhraseText: {
      fontSize: 20,
    },
    rowItemContainerView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    rowAItemContainerView: {
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
  })

  useEffect(() => {
    const updatedArraySetPhraseData = Array(data.length).fill('')
    setArraySetPhraseData(updatedArraySetPhraseData)
  }, [])

  const exportWallet = async (seed: string) => {
    console.log('sephrase', seed)
    const myKeys = await keyGen768(seed)
    const symetric = await Encrypt768(myKeys[0], seed)
    const encodeHash = md5(symetric[1])
    console.log(encodeHash)
    const { fs } = RNFetchBlob
    try {
      const documentDirectory = fs.dirs.DocumentDir
      const zipDirectory = `${documentDirectory}/Wallet_Backup`
      const destFileExists = await fs.exists(zipDirectory)
      if (destFileExists) {
        await fs.unlink(zipDirectory)
      }

      // const destFileExists = await RNFS.exists(zipDirectory)
      // if (destFileExists) {
      //   await RNFS.unlink(zipDirectory)
      // }

      const date = new Date()
      const dformat = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
      const WALLET_FILE_NAME = `SSI_Wallet_${dformat}`

      await fs
        .mkdir(zipDirectory)
        .then(() => console.log('generated'))
        .catch((err) => console.log('not generated', err))
      const destinationZipPath = `${documentDirectory}/${WALLET_FILE_NAME}.zip`
      const encryptedFileName = `${WALLET_FILE_NAME}.wallet`
      const encryptedFileLocation = `${zipDirectory}/${encryptedFileName}`
      // await RNFS.mkdir(zipDirectory)
      // const destinationZipPath = `${documentDirectory}/${WALLET_FILE_NAME}.zip`
      // const encryptedFileName = `${WALLET_FILE_NAME}.wallet`
      // const encryptedFileLocation = `${zipDirectory}/${encryptedFileName}`

      const exportConfig = {
        key: 'ayanworks',
        path: encryptedFileLocation,
      }
      console.log('exportConfig', exportConfig)
      await agent?.wallet.export(exportConfig)
      await zip(zipDirectory, destinationZipPath)
      Toast.show({
        type: ToastType.Success,
        text1: 'Backup successfully',
      })
      setMatchPhrase(true)
      navigation.navigate(Screens.Success as never)
    } catch (e) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Backup failed',
      })
    }
  }

  const addPhrase = (item: string, index: number) => {
    const updatedPhraseData = [...phraseData]
    updatedPhraseData[index] = { id: index + 1, value: item }

    const updatedArraySetPhraseData = [...arraySetPhraseData]
    updatedArraySetPhraseData[index] = item
    setPhraseData(updatedPhraseData)
    setArraySetPhraseData(updatedArraySetPhraseData)

    setNextPhraseIndex(index)
  }

  const setPhrase = (item: string, index: number) => {
    const updatedArraySetPhraseData = [...arraySetPhraseData]
    updatedArraySetPhraseData[index] = ''
    setArraySetPhraseData(updatedArraySetPhraseData)
    setNextPhraseIndex(index + 1)
  }

  const askPermission = async (sysPassPhrase: string) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
          title: 'Permission',
          message: 'PCM needs to write to storage',
          buttonPositive: '',
        })
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          exportWallet('xyz,abc')
        }
      } catch (error) {
        Toast.show({
          type: ToastType.Error,
          text1: `${error}`,
        })
      }
    } else {
      exportWallet('xyz,abc')
    }
  }

  const verifyPhrase = () => {
    const addedPassPhraseData = arraySetPhraseData.join('')
    const displayedPassphrase = phraseData.map((item) => item.value).join('')

    if (displayedPassphrase.trim() !== '') {
      const sysPassPhrase = addedPassPhraseData.trim()
      const userPassphrase = displayedPassphrase.trim()

      if (sysPassPhrase === userPassphrase) {
        askPermission(sysPassPhrase)
      } else {
        Toast.show({
          type: ToastType.Error,
          text1: 'Phrase not matched',
        })
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={[TextTheme.headerTitle, styles.titleText]}>{t('Backup.confirm_seed_phrase')}</Text>
        <Text style={[TextTheme.label, styles.detailText]}>{t('Backup.select_each')}</Text>
      </View>

      <View style={[styles.addPhraseView]}>
        {arraySetPhraseData.map((item, index) => (
          <TouchableOpacity onPress={() => setPhrase(item, index)} key={index}>
            <View style={styles.rowItemContainerView}>
              <View
                style={[
                  styles.rowAItemContainerView,
                  {
                    borderStyle: item !== '' || index === nextPhraseIndex ? 'solid' : 'dashed',
                    borderColor:
                      item !== '' || index === nextPhraseIndex ? ColorPallet.brand.primary : ColorPallet.brand.primary,
                  },
                ]}
              >
                <Text style={[TextTheme.label, styles.rowItemPhraseText]}>{item}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.setPhraseView} />

        {data.map((item, index) => (
          <TouchableOpacity
            onPress={() => addPhrase(item.value, index)}
            style={[styles.rowAddItemContainerView]}
            key={index}
          >
            <View>
              <Text style={[styles.rowAddItemText]}>{item.value}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ margin: 20 }}>
        <Button
          title={'COMPLETE BACKUP'}
          accessibilityLabel={'Okay'}
          disabled={matchPhrase}
          buttonType={ButtonType.Primary}
          onPress={verifyPhrase}
        >
          {matchPhrase && <ButtonLoading />}
        </Button>
      </View>
    </ScrollView>
  )
}

export default ExportWalletConfirmation
