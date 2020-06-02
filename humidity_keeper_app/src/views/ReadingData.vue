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
      <b-table responsive :items="readings" :fields="fields">
        <!-- A virtual column -->
        <template v-slot:cell(index)="data">
          {{ data.index + 1 }}
        </template>
      </b-table>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'ReadingData',

  data () {
    return {
      device: {
        name: ''
      },
      readings: [],
      fields: [
        {key: 'index', label: '순서', sortable: false},
        {key: 'created', label: '수집일', sortable: true, formatter: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss')},
        {key: 'temperature', label: '온도', sortable: true, formatter: (value) => Number(value.toFixed(2))},
        {key: 'humidity', label: '습도', sortable: true, formatter: (value) => Number(value.toFixed(2))},
        {key: 'battery', label: '배터리', sortable: true},
      ],
      form: {
        dateFrom: moment().subtract(0, 'day').format('YYYY-MM-DD'),
        dateTo: moment().format('YYYY-MM-DD'),
        isDisabled: false
      }
    }
  },
  computed: {
  },
  methods: {
    async onQuery(evt) {
      evt.preventDefault()
      this.form.isDisabled = true
      try {
        let q = `dateFrom=${this.form.dateFrom}&dateTo=${this.form.dateTo}&limit=50000&orderBy=created&desc=1`
        let res = await this.axios.get('/api/v1/readings/all?' + q)
        if (res.data.error) {
          this.readings = []
          alert('Update error: ' + res.data.error.message)
        } else {
          this.readings = res.data.data
        }
      }
      catch (error) {
        console.log(error)
        alert('Update error: ' + error.message)
      }
      this.form.isDisabled = false
    },
  },
  mounted () {
    this.device = this.$store.getters.findDevice(this.$route.params.id)
  }
}
</script>
