export const getBookingDates = () => {
  const today = new Date()

  const year = today.getFullYear()
  const month = today.getMonth() // 0-based
  //days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()


  //  Take the range: 1 ... (daysInMonth - 1)// * so that checkOut = checkIn + 1 fits exactly
  const randomDay = Math.floor(Math.random() * (daysInMonth - 1)) + 1

  const checkIn = new Date(year, month, randomDay)
  const checkOut = new Date(year, month, randomDay + 1)

  return { checkIn, checkOut }
}

export const formatDateForBooking = (date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export const formatDateForConfirmation = (date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

