<template>
<div class="mt-2">
  <b-card bg-variant="dark">
    <b-row>
      <b-col>
        <b-input-group style="float:right;">
          <b-button class="mx-1" v-on:click='goRuleNewFormPage()' :disabled='loading' variant="info">규칙추가</b-button>
        </b-input-group>
      </b-col>
    </b-row>
  </b-card>

  <div v-if="loading">
    <centered-loader />
  </div>

  <div v-if="!loading" class="rules-view-container">
    <br>
    <b-row v-bind:key="rule.id" v-for="rule in rules">
      <b-col xl="4" lg="6" md="12" sm="12">
        <b-card class="m-2" header-tag="header" footer-tag="footer" bg-variant="light">
          <template v-slot:header>
            <h3 class="mb-0">{{rule.name}}</h3>
          </template>
          <b-card-text v-if="rule.humidityThreshold">설정 습도: {{rule.humidityThreshold}}</b-card-text>
          <b-card-text v-if="!rule.ruleAt" v-show="rule.ctrlAt"> 최근 동작 시간: {{formatUpdateAt(rule.ctrlAt)}}</b-card-text>
          <template v-slot:footer>
            <b-button class="m-1" v-on:click="goRuleEditPage(rule.id)" variant="info">
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
import moment from 'moment'

export default {
  name: 'rules',
  components: {
  },
 
 data() {
    return {
      rules: [],
      loading: false,
    }
  },

  computed: {
  },

  methods: {

    goRuleNewFormPage() {
      this.$router.push('/rule-edit/new')
    },

    goRuleEditPage(id) {
      this.$router.push('/rule-edit/' + id)
    },

    formatUpdateAt(updateAt) {
      var mtime = moment(updateAt)
      if (mtime.isAfter(moment().subtract(2, 'days')))
        return mtime.fromNow() + ' 갱신됨' 
      else
        return mtime.format('MM-DD hh:mm') + ' 갱신됨' 
    }
  },
  
  async mounted () {
    let res = await this.axios.get('/api/v1/rules/all')
    this.rules = res.data.data
  },
  
  beforeDestroy () {
  }
}
</script>
