<template>
  <div class="device-view-container">
    <div v-if="form.isDisabled">
      <centered-loader />
    </div>

    <b-form @submit="onDeviceSave" :disabled="form.isDisabled">
      <div class="m-3">
        <h4 v-if="isEditMode"> <b-icon icon='gear-fill' aria-hidden='true'></b-icon> 장치 수정</h4>
        <h4 v-if="!isEditMode"> <b-icon icon='gear-fill' aria-hidden='true'></b-icon> 장치 추가</h4>
      </div>

      <b-card bg-variant="dark" >

        <div>
          <b-input-group prepend="이 름" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
            v-model="form.device.name" :disabled="form.isDisabled"
            required
            >
            </b-form-input>
          </b-input-group>
          <b-input-group prepend="설명" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
            v-model="form.device.desc" :disabled="form.isDisabled"
            >
            </b-form-input>
          </b-input-group>

          <b-input-group prepend="장치 타입" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-select
              v-model="form.device.type"
              :options="deviceTypes"
            ></b-form-select>
          </b-input-group>

          <b-input-group prepend="장치 주소" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
            v-model="form.device.address" :disabled="form.isDisabled"
            description="센서 맥주소 또는 액추에이터 시리얼포트 장치 이름"
            >
            </b-form-input>
          </b-input-group>
          <b-input-group prepend="설치 일자" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-datepicker v-model="form.device.registerAt"></b-form-datepicker>
          </b-input-group>
        </div>
        <hr>
        <div>
          <b-button v-on:click="onDeviceSave" variant="primary">
            저장
          </b-button>
          &nbsp;
          <b-button v-on:click="onDeviceDelete" variant="danger" v-if='isEditMode'>
            삭제
          </b-button>
        </div>
      </b-card>

    </b-form>

  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'DeviceEdit',

  data () {
    return {
      device: {
        name: '',
        desc: '',
        type: 0,
        address: '',
        registerAt: '',
      },
      isEditMode: false,
      form: {
        device: {
          name: '',
          desc: '',
          type: 0,
          address: '',
          registerAt: ''
        },
        isDisabled: false
      },
      deviceTypes: [{ text: '센서', value: 0 }, { text: '액추에이터', value: 1 }],
    }
  },
  computed: {
  },
  methods: {
    async onDeviceSave(evt) {
      evt.preventDefault()
      this.form.isDisabled = true
      try {
        if (this.isEditMode) {
          let res = await this.axios.put('/api/v1/devices/update', { device: this.form.device })
          if (res.data.error) {
            alert('Update error: ' + res.data.error.message)
          } else {
            this.$router.back()
          }
        } else {
          let res = await this.axios.post('/api/v1/devices/add', { device: this.form.device })
          if (res.data.error) {
            alert('Update error: ' + res.data.error.message)
          } else {
            this.$router.back()
          }
        }
      }
      catch (error) {
        console.log(error)
        alert('Update error: ' + error.message)
      }
      this.form.isDisabled = false
    },
    async onDeviceDelete(evt) {
      evt.preventDefault()
      this.form.isDisabled = true
      try {
        let res = await this.axios.delete('/api/v1/devices/delete/' + this.device.id)
        if (res.data.error) {
          alert('Delete error: ' + res.data.error.message)
        } else {
          this.$router.back()
        }
      }
      catch (error) {
        console.log(error)
        alert('Delete error: ' + error.message)
      }
      this.form.isDisabled = false
    },
  },
  mounted () {
    console.log('findDevice:', this.$route.params.id)
    if (this.$route.params.id == 'new') {
      this.form.device.name = ''
      this.form.device.desc = ''
      this.form.device.registerAt = new Date()
    }
    else {
      this.device = this.$store.getters.findDevice(this.$route.params.id)
      this.form.device = _.clone(this.device)
      delete this.form.device.reading
      this.isEditMode = true
    }
  }
}
</script>
