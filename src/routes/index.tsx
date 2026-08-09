import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Header from '../components/Header.tsx'
import data from '../running-train-schedules.yaml'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const ScheduleRow = ({row, lastRow}) => {
    const DrivingTime = ({time}) => {
      if (time === null || time === undefined) {
        return <></>
      }
      let ms = time.split("M")
      let sec = '00'
      if (ms[1].length !== 0) {
        sec = ms[1].substring(0, ms[1].length-1)
      }
      return (
        <div className="border border-l-4 text-center font-bold text-2xl content-center row-span-2">
          {ms[0]}<span className="text-base align-middle">{sec}</span>
        </div>
      )
    }

    const Arrival = ({time, lastTime}) => {
      if (time === null || time === undefined) {
        return (<div className="border text-center px-1 text-3xl font-bold col-span-2 content-center row-span-2">...</div>)
      }
      let prevHour = ''
      if (lastTime !== null && lastTime !== undefined) {
        prevHour = lastTime.split(':')[0]
      }
      let t = time.split(':')
      let h = ''
      if (t[0] !== prevHour) {
        h = t[0] + '.'
      }
      return(
        <div className="border text-right px-1 font-bold text-3xl col-span-2 content-center row-span-2">
          {h}{t[1]}<span className="font-bold align-top text-lg">{t[2]}</span>
        </div>
      )
    }

    const Departure = ({time, lastTime}) => {
      if (time === null || time === undefined) {
        return (<div className="border border-l-2 text-center px-1 col-span-2 text-3xl font-bold content-center row-span-2" style={{letterSpacing:"-0.4em"}}>＝＝＝</div>)
      }
      let prevHour = ''
      if (lastTime !== null && lastTime !== undefined) {
        prevHour = lastTime.split(':')[0]
      }
      let t = time.split(':')
      let h = ''
      if (t[0] !== prevHour) {
        h = t[0] + '.'
      }
      return(
        <div className="border border-l-2 text-right px-1 font-bold col-span-2 text-3xl content-center row-span-2">
          {h}{t[1]}<span className="font-bold align-top text-lg">{t[2]}</span>
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

    let lastArrivalTime = null
    if (lastRow !== null) {
      lastArrivalTime = lastRow.Arrive
    }

    let lastDepartureTime = null
    if (lastRow !== null) {
      lastDepartureTime = lastRow.Depart
    }

    let stopColour = (row != null && row.Arrive !== null && row.Arrive !== undefined)? 'bg-[var(--bg-stop)]' : ''

    return (
      <>
        <DrivingTime time={row?row.DrivingTime:null} />
        <div className={['border text-justify px-1 col-span-2 content-center row-span-2 object-fit font-bold wrap-normal', stopColour].join(' ')}>{row?row.StopName:null}</div>
        <Arrival time={row?row.Arrive:null} lastTime={lastArrivalTime} />
        <Departure time={row?row.Depart:null} lastTime={lastDepartureTime} />
        <div className="border text-center content-center row-span-2">{row?row.Track:null}</div>
        <SpeedLimit limit={row?row.SpeedLimit:null} />
        <div className="border border-r-4 text-center content-center row-span-2 p-6">{row?row.Article:null}</div>
      </>
    )
  }

  const TopBuffer = () => {
    return(
      <>
        <div className="border border-l-4 row-span-2">{ /* only span the drive time */ }</div>
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

  const Schedule = ({route, rollingStockIndex}) => {
    if (route === undefined || route === null) {
      return <>bad route</>
    }

    let schedule = []
    let lastRow = null
    if (route.Schedule !== undefined && route.Schedule !== null) {
      for (let i = 0; i < route.Schedule.length; ++i) {
        schedule.push(<ScheduleRow key={i} row={route.Schedule[i]} lastRow={lastRow} />)
        lastRow = route.Schedule[i]
      }
    } else {
      schedule.push(<ScheduleRow key="0" row={null} lastRow={null} />)
    }

    return(
      <>
        <div className="grid grid-cols-4 grid-rows-2 w-160">
          <div className="border border-t-2 border-l-4 text-center content-center font-bold text-xl px-2">
            {route.Type}
          </div>
          <div className="border border-t-2 border-l-3 text-center content-center row-span-2 text-9xl font-bold">
            <span className="text-red-400">{route.RollingStock[rollingStockIndex].Cars}</span>
          </div>
          <div className="border border-t-2 border-l-2 text-center content-center row-span-2 text-4xl font-bold">
            {route.RollingStock[rollingStockIndex].Series}<span className="text-xs align-text-bottom">series</span>
          </div>
          <div className="border border-t-2 border-l-3 border-r-4 text-center content-center row-span-2 text-6xl font-bold">
            {route.SpeedLimit}<span className="text-xs align-text-bottom">km/h</span>
          </div>
          <div className="border border-l-4 text-center content-center font-bold text-xl">
            {route.Name}
          </div>
        </div>

        <div className="grid grid-cols-10 w-160">
          <div className="border border-l-4 text-center font-bold content-center">Driving Time</div>
          <div className="border col-span-2 text-center font-bold content-center">Stop Name</div>
          <div className="border col-span-2 text-center font-bold content-center">Arrival</div>
          <div className="border col-span-2 border-l-2 text-center font-bold content-center">Departure (Passing)</div>
          <div className="border text-center font-bold content-center">Line</div>
          <div className="border text-center font-bold content-center">Speed Limit</div>
          <div className="border border-r-4 text-center font-bold content-center">Notes</div>
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

  return (
    <>
      <Header data={data} routeIndex={routeIndex} setRouteIndex={setRouteIndex} rsIndex={rsIndex} setRsIndex={setRsIndex} />
      <main className="page-wrap pb-6 pt-2">
        <Schedule route={data.Route[routeIndex]} rollingStockIndex={rsIndex} />
      </main>
    </>
  )
}
