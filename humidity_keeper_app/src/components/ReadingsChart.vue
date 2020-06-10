<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  name: 'readingChart',
  mixins: [mixins.reactiveProp],
  // Below 'chartData' prop don't need due to mixins will do it.
  props: ['chartOptions'],
  methods: {
  },
  watch: {
    chartData: function() {
      console.log('watch:')
      this.renderChart(this.chartData, this.chartOptions)
    }
  },
  mounted () {
    console.log('mounted:', this.chartData)
    this.renderChart(this.chartData, this.chartOptions)
  }
}

</script>
