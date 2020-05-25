<template>
<div class="mt-2">
  <b-card bg-variant="dark">
    <b-row>
      <b-col>
        <b-input-group style="float:right;">
          <b-form-select class="mx-1" 
            id="input-refreshInterval"
            v-model="refreshInterval"
            :options="refreshIntervals"
            v-on:change="checkRefreshTimer" 
          ></b-form-select>
          <b-button class="mx-1" v-on:click='refreshData(true)' :disabled='loading' variant="info">자료갱신</b-button>
          <b-button class="mx-1" v-on:click='goDeviceNewFormPage()' :disabled='loading' variant="info">장치추가</b-button>
        </b-input-group>
      </b-col>
    </b-row>
  </b-card>

  <div v-if="loading">
    <centered-loader />
  </div>

  <div v-if="!loading" class="devices-view-container">
    <br>
    <b-row v-bind:key="device._id" v-for="device in devices">
      <b-col xl="4" lg="6" md="12" sm="12">
        <b-card class="m-2" header-tag="header" footer-tag="footer" bg-variant="light">
          <template v-slot:header>
            <h3 class="mb-0">{{device.name}}</h3>
          </template>
          <b-button v-if="device.type==1" class="m-1" v-on:click="sendIRPowerKey(device.address)" variant="success">
            <b-icon icon='wifi' aria-hidden='true'></b-icon> 리모컨 파워키 전송
          </b-button>
          <br>
          <b-button v-if="device.type==1" class="m-1" v-on:click="readLightStatus(device.address)" variant="success">
            <b-icon icon='octagon-half' aria-hidden='true'></b-icon> 경광등 상태 읽기
          </b-button>
          <b-icon v-show="device.type==1&&lightStatus==-1" icon='x' aria-hidden='true'></b-icon>
          <b-icon v-show="device.type==1&&lightStatus==0" icon='circle' aria-hidden='true'></b-icon>
          <b-icon v-show="device.type==1&&lightStatus==1" icon='circle-fill' aria-hidden='true'></b-icon>
          <b-button v-if="device.type==1" class="m-1" v-on:click="writeLightStatus(device.address, false)" variant="success">
            <b-icon icon='toggle-off' aria-hidden='true'></b-icon> 경광등 끄기
          </b-button>
          <b-button v-if="device.type==1" class="m-1" v-on:click="writeLightStatus(device.address, true)" variant="danger">
            <b-icon icon='toggle-on' aria-hidden='true'></b-icon> 경광등 켜기
          </b-button>
          <b-card-text v-if="device.type==0" v-show="!device.reading">센서 데이터 없음</b-card-text>
          <template v-slot:footer>
            <b-button v-if="device.type==0" class="m-1" v-on:click="goReadingDataPage(device.id)" variant="info">
              <b-icon icon='table' aria-hidden='true'></b-icon>
            </b-button>
            <b-button v-if="device.type==0" class="m-1" v-on:click="goReadingChartPage(device.id)" variant="info">
              <b-icon icon='graph-up' aria-hidden='true'></b-icon>
            </b-button>
            <b-button class="m-1" v-on:click="goDeviceEditPage(device.id)" variant="info">
              <b-icon icon='gear-fill' aria-hidden='true'></b-icon>
            </b-button>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</div>

</template>
<script>
import { mapActions, mapState } from "vuex"

export default {
  name: 'devices',
  components: {
  },
 
 data() {
    return {
      loading: false,
      timer: null,
      lightStatus: -1,
      refreshInterval: 0,
      refreshIntervals: [
        { text: '자동 갱신 미사용', value: 0 },
        { text: '10초', value: 10000 },
        { text: '30초', value: 30000 },
        { text: '1분', value: 60000 }
        ]
    }
  },
  computed: {
    ...mapState([
      'devices'
    ])
  },
  methods: {
    ...mapActions([
      'fetchDevices'
    ]),

    async refreshData(setLoading) {
      if (setLoading)
        this.loading = true

      try {
        await this.fetchDevices()
      } catch (error) {
        console.log('fetchDevices error: ', error)
        clearInterval(this.timer)
      }

      if (setLoading)
        this.loading = false
    },

    checkRefreshTimer() {
      clearInterval(this.timer)
      if (this.refreshInterval > 0) {
        this.timer = setInterval(() => this.refreshData(false), this.refreshInterval)
      }
    },

    async sendIRPowerKey(address) {
      this.loading = true
      try {
        let message = { address: address, text: 'ir.NEC 40FF00FF\r'}
        console.log('SEND', message)
        let res = await this.axios.post('/api/v1/actuators/serial-write', { message: message })
        if (res.data.error) {
          alert('Update error: ' + res.data.error.message)
        } else {
          console.log('serial response:', res.data.data)
          // output 형식: 200 40FF00FF
          let match = res.data.data.match(/(\d+) (.+)/)
          if (match[1] == 200) {
          } else {
            alert('키 전송 실패: ' + match[0])
          }
        }
      }
      catch (error) {
        console.log(error)
        alert('Request Error: ' + error.message)
      }
      this.loading = false
    },

    async readLightStatus(address) {
      this.loading = true
      try {
        let message = { address: address, text: 'gpio.get 12\r' }
        console.log('SEND', message)
        let res = await this.axios.post('/api/v1/actuators/serial-write', { message: message })
        if (res.data.error) {
          this.llightStatus = -1
          alert('Update error: ' + res.data.error.message)
        } else {
          // output 형식: 200 [0|1]
          let match = res.data.data.match(/(\d+) (.+)/)
          if (match[1] == 200) {
            this.lightStatus = parseInt(match[2])
          } else {
            alert('경광등 상태 읽기 실패: ' + match[0])
            this.lightStatus = -1
          }
        }
      }
      catch (error) {
        alert('Request Error: ' + error.message)
      }
      this.loading = false
    },

    async writeLightStatus(address, isOn) {
      this.loading = true
      try {
        let message = { address: address, text: isOn ? 'gpio.high 12\r' : 'gpio.low 12\r' }
        console.log('SEND', message)
        let res = await this.axios.post('/api/v1/actuators/serial-write', { message: message })
        if (res.data.error) {
          this.llightStatus = -1
          alert('Update error: ' + res.data.error.message)
        } else {
          // output 형식: 200 [0|1]
          let match = res.data.data.match(/(\d+) (.+)/)
          if (match[1] == 200) {
            this.lightStatus = parseInt(match[2])
          } else {
            alert('경광등 상태 쓰기 실패: ' + match[0])
            this.lightStatus = -1
          }
        }
      }
      catch (error) {
        alert('Request Error: ' + error.message)
      }
      this.loading = false
    },

    goDeviceNewFormPage() {
      this.$router.push('/device-edit/new')
    },

    goReadingDataPage(id) {
      this.$router.push('/reading-data/' + id)
    },

    goReadingChartPage(id) {
      this.$router.push('/reading-chart/' + id)
    },

    goDeviceEditPage(id) {
      this.$router.push('/device-edit/' + id)
    },

  },
  
  async mounted () {
    try {
      await this.fetchDevices()
    } catch (error) {
      console.log('fetchDevices error: ', error)
    }
    this.checkRefreshTimer()
  },
  
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
