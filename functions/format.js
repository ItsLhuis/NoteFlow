import { format, isToday, isYesterday, subDays, startOfToday } from "date-fns"
import { ptBR } from "date-fns/locale"

const dayOfWeekEnum = {
  domingo: "Dom.",
  segunda: "Seg.",
  terça: "Ter.",
  quarta: "Qua.",
  quinta: "Qui.",
  sexta: "Sex.",
  sábado: "Sáb."
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)

  if (isToday(date)) {
    return "Hoje"
  }

  if (isYesterday(date)) {
    return "Ontem"
  }

  const dayBeforeYesterday = subDays(startOfToday(), 2)
  if (
    date.getDate() === dayBeforeYesterday.getDate() &&
    date.getMonth() === dayBeforeYesterday.getMonth() &&
    date.getFullYear() === dayBeforeYesterday.getFullYear()
  ) {
    return "Anteontem"
  }

  const currentYear = new Date().getFullYear()
  const dateYear = date.getFullYear()
  if (dateYear !== currentYear) {
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  return format(date, "d 'de' MMMM", { locale: ptBR })
}

export const formatTime = (dateString) => {
  const date = new Date(dateString)
  const formattedTime = format(date, "HH:mm")
  return formattedTime
}

export const formatTodayDate = (dateString) => {
  const date = new Date(dateString)

  const currentYear = new Date().getFullYear()
  const dateYear = date.getFullYear()
  if (dateYear !== currentYear) {
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  return format(date, "d 'de' MMMM", { locale: ptBR })
}

export const formatFullDate = (dateString) => {
  const date = new Date(dateString)

  if (isToday(date)) {
    return `Hoje, ${format(date, "HH:mm")}`
  }

  if (isYesterday(date)) {
    return `Ontem, ${format(date, "HH:mm")}`
  }

  const dayBeforeYesterday = subDays(startOfToday(), 2)
  if (
    date.getDate() === dayBeforeYesterday.getDate() &&
    date.getMonth() === dayBeforeYesterday.getMonth() &&
    date.getFullYear() === dayBeforeYesterday.getFullYear()
  ) {
    return `Anteontem, ${format(date, "HH:mm")}`
  }

  const currentYear = new Date().getFullYear()
  const dateYear = date.getFullYear()
  const yearPart = dateYear !== currentYear ? `, ${dateYear}` : ""

  const dayOfWeek = dayOfWeekEnum[format(date, "E", { locale: ptBR })]
  const dayOfMonth = format(date, "d", { locale: ptBR })
  const monthName = format(date, "MMMM", { locale: ptBR })

  return `${dayOfWeek}, ${dayOfMonth} ${monthName}${yearPart}, ${format(date, "HH:mm")}`
}
