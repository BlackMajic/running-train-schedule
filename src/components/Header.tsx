import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import {
  Avatar,
  Autocomplete,
  EmptyState,
  ListBox,
  SearchField,
  Select,
  useFilter,
} from "@heroui/react"

const LineAvatar = ({route, extraClass}) => {
  let lineColour = 'bg-line-ta'
  let lineShort = 'KR'
  if (route.Line === 'Sankai Main Line') {
    lineColour = 'bg-line-ha'
    lineShort = 'HA'
  }

  return(
    <Avatar size="sm" className={['rounded-sm', extraClass].join(' ')}>
      <Avatar.Fallback className={['font-bold text-white', lineColour].join(' ')}>{lineShort}</Avatar.Fallback>
    </Avatar>
  )
}

export default function Header({data, routeIndex, setRouteIndex, rsIndex, setRsIndex, langIndex, setLangIndex}) {
  const {contains} = useFilter({sensitivity: "base"})

  const handleRoute = (v) => {
    setRouteIndex(v)
    if (data.Route[v].RollingStock.length < rsIndex) {
      setRsIndex(0)
    }
  }

  const handleStock = (v) => {
    setRsIndex(v)
  }

  const handleLang = (v) => {
    setLangIndex(v)
  }

  let i = 0
  let j = 0
  let k = 0

  const langmoji = (lang) => {
    if (lang === 'en') {
      return(<>🇬🇧</>)
    }
    if (lang === 'jp') {
      return (<>🇯🇵</>)
    }
  }

  return (
    <header className="no-print top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-1 sm:py-1">
        <div className="order-1 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0">
          <Select className="w-[70px]" onChange={handleLang} value={langIndex}>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {data.Language.map((lang) => (
                  <ListBox.Item key={k} id={k++} textValue={lang}>
                    {langmoji(lang)}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="order-2 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0">
          <Autocomplete
            className="w-[256px]"
            selectionMode="single"
            variant="primary"
            value={routeIndex}
            onChange={handleRoute}
          >
            <Autocomplete.Trigger>
              <Autocomplete.Value>
                {({defaultChildren, isPlaceholder, state}) => {
                  if (isPlaceholder || state.selectedItems.length === 0) {
                    return defaultChildren
                  }
                  const selectedItem = state.selectedItems[0]
                  if (!selectedItem) {
                    return defaultChildren
                  }

                  return(
                    <div className="flex items-center gap-2">
                      <LineAvatar route={data.Route[routeIndex]} extraClass={'size-6'} />
                      <span className="font-black">{selectedItem.textValue}</span>
                    </div>
                  )
                }}
              </Autocomplete.Value>
              <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
              <Autocomplete.Filter filter={contains}>
                <SearchField autoFocus name="search" variant="secondary">
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox renderEmptyState={()=><EmptyState>No routes found</EmptyState>}>
                  {data.Route.map((route)=>{
                    return(
                    <ListBox.Item
                      key={route.Type+'.'+route.Name}
                      id={i++}
                      textValue={route.Type+'.'+route.Name}
                      isDisabled={route.Schedule === null}
                      className="font-black"
                    >
                      <LineAvatar route={route} extraClass="" />
                      {route.Type+'.'+route.Name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  )})}
                </ListBox>
              </Autocomplete.Filter>
            </Autocomplete.Popover>
          </Autocomplete>
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0">
          <Select className="w-[115px]" onChange={handleStock} value={rsIndex}>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {data.Route[routeIndex].RollingStock.map((set) => (
                  <ListBox.Item key={j} id={j++} textValue={set.Train+'-'+set.Cars}>
                    {set.Train+'-'+set.Cars}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/*
          <Link to="/about"
            className="hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block"
          >
            <span className="sr-only">About</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
              <path fill="currentColor" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path fill="currentColor" d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
            </svg>
          </Link>
          */}
          <a
            href="https://github.com/BlackMajic/running-train-schedule"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block"
          >
            <span className="sr-only">Running Train Schedule Github</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
          <a
            href="https://store.steampowered.com/app/4630570/RUNNING_TRAIN/"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block"
          >
            <span className="sr-only">Running Train on Steam</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
              <path fill="currentColor" d="M.329 10.333A8.01 8.01 0 0 0 7.99 16C12.414 16 16 12.418 16 8s-3.586-8-8.009-8A8.006 8.006 0 0 0 0 7.468l.003.006 4.304 1.769A2.2 2.2 0 0 1 5.62 8.88l1.96-2.844-.001-.04a3.046 3.046 0 0 1 3.042-3.043 3.046 3.046 0 0 1 3.042 3.043 3.047 3.047 0 0 1-3.111 3.044l-2.804 2a2.223 2.223 0 0 1-3.075 2.11 2.22 2.22 0 0 1-1.312-1.568L.33 10.333Z"/>
              <path fill="currentColor" d="M4.868 12.683a1.715 1.715 0 0 0 1.318-3.165 1.7 1.7 0 0 0-1.263-.02l1.023.424a1.261 1.261 0 1 1-.97 2.33l-.99-.41a1.7 1.7 0 0 0 .882.84Zm3.726-6.687a2.03 2.03 0 0 0 2.027 2.029 2.03 2.03 0 0 0 2.027-2.029 2.03 2.03 0 0 0-2.027-2.027 2.03 2.03 0 0 0-2.027 2.027m2.03-1.527a1.524 1.524 0 1 1-.002 3.048 1.524 1.524 0 0 1 .002-3.048"/>
            </svg>
          </a>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
