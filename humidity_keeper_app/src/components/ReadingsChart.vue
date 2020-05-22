<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  name: 'readingChart',
  mixins: [mixins.reactiveProp],
  props: [
    'chartData',
  ],
  mounted () {
    console.log('chartData:', this.chartData)
    this.renderChart(this.chartData, {responsive: true, maintainAspectRatio: true})
  }
}

</script>
