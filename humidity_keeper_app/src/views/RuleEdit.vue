<template>
  <div class="rule-view-container">
    <div v-if="form.isDisabled">
      <centered-loader />
    </div>

    <b-form @submit="onRuleSave" :disabled="form.isDisabled">
      <div class="m-3">
        <h4 v-if="isEditMode"> <b-icon icon='gear-fill' aria-hidden='true'></b-icon> 규칙 수정</h4>
        <h4 v-if="!isEditMode"> <b-icon icon='gear-fill' aria-hidden='true'></b-icon> 규칙 추가</h4>
      </div>

      <b-card>

        <div>
          <b-input-group prepend="이 름" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
            v-model="form.rule.name" :disabled="form.isDisabled"
            required
            >
            </b-form-input>
          </b-input-group>

          <b-input-group prepend="참조센서" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-select
              v-model="form.rule.sensorId"
              :options="sensorDevices"
              required
            ></b-form-select>
          </b-input-group>

          <b-input-group prepend="타겟장치" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-select
              v-model="form.rule.actuatorId"
              :options="actuatorDevices"
              required
            ></b-form-select>
          </b-input-group>

          <b-input-group prepend="습도경계값" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
            v-model="form.rule.humidityThreshold" :disabled="form.isDisabled"
            type="number"
            required
            >
            </b-form-input>
          </b-input-group>

          <b-input-group prepend="동작적용여부" class="mb-2 mr-sm-2 mb-sm-2">
            &nbsp;
            &nbsp;
            <b-form-checkbox class="m-1 mx-3" 
            v-model="form.rule.ctrlLight" :disabled="form.isDisabled"
            value="1" unchecked-value="0"
            required
            >
            경광등 제어
            </b-form-checkbox>
            &nbsp;
            <b-form-checkbox class="m-1"
            v-model="form.rule.ctrlPower" :disabled="form.isDisabled"
            value="1" unchecked-value="0"
            required
            >
            가습기제어
            </b-form-checkbox>
          </b-input-group>

          <b-input-group prepend="적용시작시간" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
            v-model="form.rule.ctrlBegin" :disabled="form.isDisabled"
            placeholder="HHMMSS 형식 - 예: 000000"
            required
            >
            </b-form-input>
          </b-input-group>

          <b-input-group prepend="적용종료시간" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
            v-model="form.rule.ctrlEnd" :disabled="form.isDisabled"
            placeholder="HHMMSS 형식 - 예: 235959"
            required
            >
            </b-form-input>
          </b-input-group>

          <b-input-group prepend="적용요일" class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
            v-model="form.rule.ctrlWeeks" :disabled="form.isDisabled"
            description="0: 일, 1: 월 ... 6:토"
            >
            </b-form-input>
          </b-input-group>

        </div>
        <hr>
        <div>
          <b-button v-on:click="onRuleSave" variant="primary">
            저장
          </b-button>
          &nbsp;
          <b-button v-on:click="onRuleDelete" variant="danger" v-if='isEditMode'>
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
import { mapActions, mapState } from "vuex"

export default {
  name: 'RuleEdit',

  data () {
    return {
      rule: {
      },
      isEditMode: false,
      form: {
        rule: {
          name: '',
          sensorId: '',
          actuatorId: '',
          ctrlLight: false,
          ctrlPower: false,
          ctrlBegin: '00:00:00',
          ctrlEnd: '23:59:59',
          ctrlWeeks: '0123456',
          ctrlAt: '',
        },
        isDisabled: false
      },
      sensorDevices: [],
      actuatorDevices: [],
    }
  },
  computed: {
    ...mapState([
      'devices'
    ])
  },
  methods: {
    async onRuleSave(evt) {
      evt.preventDefault()
      this.form.isDisabled = true
      try {
        if (this.isEditMode) {
          let res = await this.axios.put('/api/v1/rules/update', { rule: this.form.rule })
          if (res.data.error) {
            alert('Update error: ' + res.data.error.message)
          } else {
            this.$router.back()
          }
        } else {
          let res = await this.axios.post('/api/v1/rules/add', { rule: this.form.rule })
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
    async onRuleDelete(evt) {
      evt.preventDefault()
      this.form.isDisabled = true
      try {
        let res = await this.axios.delete('/api/v1/rules/delete/' + this.rule.id)
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
  async mounted () {
    for (let device of this.devices) {
      if (device.type == 0) {
        this.sensorDevices.push({ text: device.name, value: device.id})
      } else {
        this.actuatorDevices.push({ text: device.name, value: device.id})
      }
    }
    if (this.$route.params.id == 'new') {
    }
    else {
      let res = await this.axios.get('/api/v1/rules/one?id=' +this.$route.params.id )
      this.rule = res.data.data
      this.form.rule = _.clone(this.rule)
      this.isEditMode = true
    }
  }
}
</script>
