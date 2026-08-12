import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Header from '../components/Header.tsx'
import data from '../running-train-schedules.yaml'

export const Route = createFileRoute('/')({ component: App })

function newDate(d) {
  return new Date('1970-01-01T'+d+'Z')
}

function App() {
  const ScheduleRow = ({row, lastRow}) => {
    const DrivingTime = ({lastDeparture, arrival, departure}) => {
      const emptyCell = <div className="border border-l-4 text-center font-bold text-2xl content-center row-span-2"></div>
      if (lastDeparture === undefined || lastDeparture === null) {
        return <></>
      } if ((arrival === undefined || arrival === null) && (departure === undefined || departure === null)) {
        return emptyCell
      }

      const thisStation = (arrival !== undefined && arrival !== null) ? arrival : departure
      const arriveOrPass = newDate(thisStation)
      const departed = newDate(lastDeparture)
      const duration = new Date(arriveOrPass-departed)
      return (
        <div className="border border-l-4 text-center font-bold text-2xl content-center row-span-2">
          {duration.getUTCMinutes()}<span className="text-base align-middle">{duration.getUTCSeconds().toString().padStart(2, '0')}</span>
        </div>
      )
    }

    const Arrival = ({arrival, prevDeparture}) => {
      if (arrival === null || arrival === undefined) {
        return (<div className="border text-center px-1 text-3xl font-bold col-span-2 content-center row-span-2">...</div>)
      }
      let prevHour = -1
      if (prevDeparture !== null && prevDeparture !== undefined) {
        prevHour = newDate(prevDeparture).getUTCHours()
      }
      let t = newDate(arrival)
      let h = ''
      if (t.getUTCHours() !== prevHour) {
        h = t.getUTCHours().toString().padStart(2, '0') + '.'
      }
      return(
        <div className="border text-right px-1 font-bold text-3xl col-span-2 content-center row-span-2">
          {h}{t.getUTCMinutes().toString().padStart(2, '0')}<span className="font-bold align-top text-lg">{t.getUTCSeconds().toString().padStart(2, '0')}</span>
        </div>
      )
    }

    const Departure = ({departure, prevDeparture}) => {
      if (departure === null || departure === undefined) {
        return (<div className="border border-l-2 text-center px-1 col-span-2 text-3xl font-bold content-center row-span-2" style={{letterSpacing:"-0.5em"}}>＝＝</div>)
      }
      let prevHour = -1
      if (prevDeparture !== null && prevDeparture !== undefined) {
        prevHour = new Date('1970-01-01T'+prevDeparture).getUTCHours()
      }
      let t = new Date('1970-01-01T'+departure)
      let h = ''
      if (t.getUTCHours() !== prevHour) {
        h = t.getUTCHours().toString().padStart(2, '0') + '.'
      }
      return(
        <div className="border border-l-2 text-right px-1 font-bold col-span-2 text-3xl content-center row-span-2">
          {h}{t.getUTCMinutes().toString().padStart(2, '0')}<span className="font-bold align-top text-lg">{t.getUTCSeconds().toString().padStart(2, '0')}</span>
        </div>
      )
    }

    const SpeedLimit = ({limit}) => {
      let limits = ['','']
      if (limit !== null && limit !== undefined) {
        limits = limit.split('/')
      }
      return(
      <div className="border text-center font-black content-center row-span-2 text-base">
        <div className="grid grid-rows-2 grid-cols-3 px-2">
          <div className="col-span-2 text-left">{limits[0]}</div>
          <div></div><div></div>
          <div className="col-span-2 text-right">{limits[1]}</div>
        </div>
      </div>
      )
    }

    if (row === undefined || row === null) {
      return (<></>)
    }

    let lastArrivalTime = null
    if (lastRow !== null) {
      lastArrivalTime = lastRow.Arrive
    }

    let lastDepartureTime = null
    if (lastRow !== null) {
      lastDepartureTime = lastRow.Depart
    }

    let stopColour = (row.Arrive !== null && row.Arrive !== undefined)? 'bg-[var(--bg-stop)]' : ''

    return (
      <>
        <DrivingTime lastDeparture={lastDepartureTime} arrival={row.Arrive} departure={row.Depart} />
        <div className={['border text-justify px-1 col-span-2 content-center row-span-2 object-fit font-bold wrap-normal', stopColour].join(' ')}>{row.Station.Name[langIndex]}</div>
        <Arrival arrival={row.Arrive} prevDeparture={lastArrivalTime} />
        <Departure departure={row.Depart} prevDeparture={lastDepartureTime} />
        <div className="border text-center content-center row-span-2">{row.Track}</div>
        <SpeedLimit limit={row.SpeedLimit} />
        <div className="border border-r-4 text-center content-center row-span-2 p-6">{row.Article}</div>
      </>
    )
  }

  const TopBuffer = () => {
    return(
      <>
        <div className="border border-l-4 row-span-2">{ /* drive time, rowspan first entry */ }</div>
        <div className="border col-span-2">{ /* stop */ }</div>
        <div className="border col-span-2">{ /* arrival */ }</div>
        <div className="border border-l-2 col-span-2">{ /* departure */ }</div>
        <div className="border">{ /* track */ }</div>
        <div className="border">{ /* speed */ }</div>
        <div className="border border-r-4 p-3">{ /* notes */ }</div>
      </>
    )
  }

  const BottomBuffer = () => {
    return(
      <>
        <div className="border border-l-4 row-span-2">{ /* drive time */ }</div>
        <div className="border col-span-2 row-span-2">{ /* stop */ }</div>
        <div className="border col-span-2 row-span-2">{ /* arrival */ }</div>
        <div className="border border-l-2 col-span-2 row-span-2">{ /* departure */ }</div>
        <div className="border row-span-2">{ /* track */ }</div>
        <div className="border row-span-2">{ /* speed */ }</div>
        <div className="border border-r-4 row-span-2 p-6">{ /* pad notes for proper sizing */ }</div>
      </>
    )
  }

  const Schedule = ({route, rollingStockIndex, langIndex, loc}) => {
    if (route === undefined || route === null) {
      return <>bad route</>
    }

    let schedule = []
    let lastRow = null
    const extra = (route.Extra)? ' X':''
    if (route.Schedule !== undefined && route.Schedule !== null) {
      for (let i = 0; i < route.Schedule.length; ++i) {
        schedule.push(<ScheduleRow key={i} row={route.Schedule[i]} lastRow={lastRow} />)
        lastRow = route.Schedule[i]
      }
    } else {
      schedule.push(<ScheduleRow key="0" row={null} lastRow={null} />)
    }

    let fields = []
    if (route.Type === 'Local') {
      fields.push(loc.Local[langIndex])
    } else if (route.Type === 'Ltd.Exp') {
      fields.push(loc.LtdExp[langIndex])
    }
    fields.push(
      loc.Series[langIndex],
      loc.Kph[langIndex],
      loc.DrivingTime[langIndex],
      loc.StopName[langIndex],
      loc.Arrival[langIndex],
      loc.Departure[langIndex],
      loc.Track[langIndex],
      loc.SpeedLimit[langIndex],
      loc.Note[langIndex]
    )

    return(
      <>
        <div className="grid grid-cols-4 grid-rows-2 w-160">
          <div className="border border-t-2 border-l-4 text-center content-center font-bold text-xl px-2">
            {fields.shift()}
          </div>
          <div className="border border-t-2 border-l-3 text-center content-center row-span-2 text-9xl font-bold">
            <span className="text-red-400">{route.RollingStock[rollingStockIndex].Cars}</span>
          </div>
          <div className="border border-t-2 border-l-2 text-center content-center row-span-2 text-4xl font-bold">
            {route.RollingStock[rollingStockIndex].Series}<span className="text-xs align-text-bottom">{fields.shift()}</span>
          </div>
          <div className="border border-t-2 border-l-3 border-r-4 text-center content-center row-span-2 text-6xl font-bold">
            {route.SpeedLimit}<span className="text-xs align-text-bottom">{fields.shift()}</span>
          </div>
          <div className="border border-l-4 text-center content-center font-bold text-xl">
            {route.Name}{extra}
          </div>
        </div>

        <div className="grid grid-cols-10 w-160">
          <div className="border border-l-4 text-center font-bold content-center">{fields.shift()}</div>
          <div className="border col-span-2 text-center font-bold content-center">{fields.shift()}</div>
          <div className="border col-span-2 text-center font-bold content-center">{fields.shift()}</div>
          <div className="border col-span-2 border-l-2 text-center font-bold content-center">{fields.shift()}</div>
          <div className="border text-center font-bold content-center">{fields.shift()}</div>
          <div className="border text-center font-bold content-center">{fields.shift()}</div>
          <div className="border border-r-4 text-center font-bold content-center">{fields.shift()}</div>
          <TopBuffer />
          {schedule}
          <BottomBuffer />
          <BottomBuffer />
          <BottomBuffer />
          <div className="border border-l-4 p-3"></div>
        </div>
      </>
    )
  }

  const [routeIndex, setRouteIndex] = useState(0)
  const [rsIndex, setRsIndex] = useState(0)
  const [langIndex, setLangIndex] = useState(0)

  return (
    <>
      <Header data={data}
        routeIndex={routeIndex} setRouteIndex={setRouteIndex}
        rsIndex={rsIndex} setRsIndex={setRsIndex}
        langIndex={langIndex} setLangIndex={setLangIndex}
      />
      <main className="page-wrap pb-6 pt-2">
        <Schedule route={data.Route[routeIndex]} rollingStockIndex={rsIndex} langIndex={langIndex} loc={data.Loc} />
      </main>
    </>
  )
}
