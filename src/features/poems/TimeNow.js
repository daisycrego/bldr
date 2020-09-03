import React from 'react'
import { parseISO, format } from 'date-fns'

export const TimeNow = ({ timestamp }) => {
  let date
  let formattedTime = ''
  if (timestamp) {
    date = parseISO(timestamp)
    formattedTime = format(date, 'MM/dd/yyyy hh:mm aaaa')
  }

  return (
    <span title={timestamp}>
      &nbsp; <i>{formattedTime}</i>
    </span>
  )
}