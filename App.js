import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar
} from 'react-native'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      latitude: null,
      longitude: null,
      err: null,
      wind: null,
      temp: null,
      title: null,
      condition: '',
      fetchingLocation: true
    }
    this.updatePosition = this.updatePosition.bind(this)
    this.updateWeather = this.updateWeather.bind(this)
  }

  componentWillMount () {
    this.updatePosition()
  }

  updateWeather () {
    var { latitude, longitude } = this.state
    var apikey = '1c6ddc6035ecb402404030304be16638'
    var endpoint = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + apikey + '&units=metric'
    return fetch(endpoint)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          temp: responseJson.main.temp + ' Celcius',
          condition: responseJson.weather[0].main,
          wind: responseJson.wind.speed + ' m/s',
          title: responseJson.name,
          fetchingLocation: false
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  updatePosition () {
    navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          err: null
        })
      },
      (error) => this.setState({ err: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  render () {
    var { err, wind, temp, title, condition } = this.state
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor='blue'
          barStyle='light-content'
        />
        <View style={{ top: 0, height: 60, left: 0, right: 0, backgroundColor: 'steelblue', alignItems: 'center', position: 'absolute' }}>
          <Text style={{ color: 'white', fontSize: 20, top: 30 }}>#Wuzizthaweatr</Text>
        </View>
        <Text style={{fontSize: 30}}>{ title }</Text>
        <Text style={{fontSize: 20}}>{ condition }</Text>
        <Text style={{fontSize: 25}}>{ temp }</Text>
        <Text style={{fontSize: 15}}>{ wind }</Text>
        <Button
          title='Update'
          onPress={() => {
            this.updatePosition()
            this.updateWeather()
          }}
          style={styles.updateBtn}
        />
        { err ? <Text>Error {err}</Text> : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  weather: {
    fontSize: 20
  },
  position: {
    fontSize: 10
  },
  updateBtn: {
    bottom: 30,
    color: 'steelblue'
  }
})
