import moment from 'moment'

export function parseStartOfDate(datePart: string | null) {
  if (datePart)
    return moment(datePart).startOf('day').unix() * 1000
  else
    return 0
}

var endOfDate = moment('2050-12-31').endOf('day').unix() * 1000

export function parseEndOfDate(datePart: string | null) {
  if (datePart)
    return moment(datePart).endOf('day').unix() * 1000
  else
    return endOfDate
}

export function nearestMinutes(interval: number, someMoment: moment.Moment){
  const roundedMinutes = Math.round(someMoment.clone().minute() / interval) * interval
  return someMoment.clone().minute(roundedMinutes).second(0)
}

export function nearestPastMinutes(interval: number, someMoment: moment.Moment){
  const roundedMinutes = Math.floor(someMoment.minute() / interval) * interval
  return someMoment.clone().minute(roundedMinutes).second(0)
}

export function nearestFutureMinutes(interval: number, someMoment: moment.Moment){
  const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval
  return someMoment.clone().minute(roundedMinutes).second(0)
}

export default {
  parseStartOfDate,
  parseEndOfDate,
  nearestMinutes,
  nearestPastMinutes,
  nearestFutureMinutes,
}
