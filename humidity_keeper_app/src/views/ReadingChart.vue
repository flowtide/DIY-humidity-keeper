<template>
  <div class="device-view-container">
    <div v-if="form.isDisabled">
      <centered-loader />
    </div>

    <b-form @submit="onQuery" :disabled="form.isDisabled">
      <div class="m-3">
        <h4> <b-icon icon='table' aria-hidden='true'></b-icon> <b>{{device.name}}</b> 센서 데이터 조회</h4>
      </div>

      <b-card bg-variant="dark" >
        <b-row>
          <b-col sm="auto">
            <b-input-group prepend="시작일" class="mb-2 mr-sm-2 mb-sm-2">
              <b-form-datepicker v-model="form.dateFrom"></b-form-datepicker>
            </b-input-group>
          </b-col>
          <b-col sm="auto">
            <b-input-group prepend="종료일" class="mb-2 mr-sm-2 mb-sm-2">
              <b-form-datepicker v-model="form.dateTo"></b-form-datepicker>
            </b-input-group>
          </b-col>
          <b-col sm="auto">
            <b-button class="col" id="data-button1" v-on:click="onQuery" variant="info">
              조회
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-form>

    <div>
      <b-row>
        <b-col sm="auto">
          <readings-chart v-if="readings.length > 0" :chartData="chartData"></readings-chart>
        </b-col>
      </b-row>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import readingsChart from '../components/ReadingsChart.vue'

export default {
  name: 'ReadingChart',

  data () {
    return {
      device: {
        name: ''
      },
      readings: [],
      chartData: {},
      form: {
        dateFrom: moment().subtract(0, 'day').format('YYYY-MM-DD'),
        dateTo: moment().format('YYYY-MM-DD'),
        isDisabled: false
      }
    }
  },
  chartOptions: {
    responsive: true,
    maintainAspectRatio: true
  },
  components: {
    readingsChart,
  },
  computed: {
  },
  methods: {
    async onQuery(evt) {
      evt.preventDefault()
      this.form.isDisabled = true
      try {
        let q = `dateFrom=${this.form.dateFrom}&dateTo=${this.form.dateTo}&limit=50000&orderBy=created&desc=0`
        let res = await this.axios.get('/api/v1/readings/all?' + q)
        if (res.data.error) {
          this.readings = []
          alert('Update error: ' + res.data.error.message)
        } else {
          this.readings = res.data.data
          this.createChartData(this.readings)
        }
      }
      catch (error) {
        console.log(error)
        alert('Update error: ' + error.message)
      }
      this.form.isDisabled = false
    },
    computeDurationByRecordCount(numReadings) {
      let duration = 30 * 60
      if (numReadings < 120)
        duration = 1 * 60
      else if (numReadings < 120 * 3)
        duration = 5 * 60
      else if (numReadings < 120 * 6)
        duration = 10 * 60
      else if (numReadings < 120 * 12)
        duration = 15 * 60
      return duration
    },
    createChartData(readings) {
      let duration = this.computeDurationByRecordCount(readings.length)
      let samples = this.makeSamples(this.readings, duration)
      console.log(samples)
      this.chartData.labels = _.map(samples, reading => moment(reading.created).format('DD HH:mm'))
      this.chartData.datasets = [{
          label: '온도',
          borderColor: 'rgba(255, 56, 96, 0.5)',
          backgroundColor: 'rgba(255, 56, 96, 0.1)',
          fill: false,
          data: _.map(samples, reading => reading.temperature)
        }, {
          label: '습도',
          borderColor: 'blue',
          fill: false,
          data: _.map(samples, reading => reading.humidity)
        }
      ]
    },

    makeSamples(readings, samplingDuration) {
      let reduced = {}
      let samplingDurationMillis = samplingDuration * 1000
      for (let reading of readings) {
        let alignedTime = reading.created - (reading.created % samplingDurationMillis)
        reduced[alignedTime] =reading
      }

      return _.map(reduced, (value, key) => value)
    }

  },
  mounted () {
    this.device = this.$store.getters.findDevice(this.$route.params.id)
  }
}
</script>
