import toNum from '../toNum'
import numberWithCommas from '../toString'
import  { Jumbotron, Form, Button, Row, Col, Card }from 'react-bootstrap'
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken = process.env.pk.eyJ1IjoibGFtamlsYW1wYWdvIiwiYSI6ImNrZnpjbjRvaDBiOGUydG9iZzFpMXVubnoifQ.OB02jXjeregqO3TB-t7uhA
import { useState, useRef, useEffect } from 'react'
import DoughnutChart from '../components/DoughnutChart'

export default function Home({data}){
  const countriesStats = data.countries_stat
	const [targetCountry, setTargetCountry] = useState('')
	const [name, setName] = useState('')
	const [cases, setCases] = useState(0)
	const [criticals, setCriticals] = useState(0)
	const [deaths, setDeaths] = useState(0)
  const [recoveries, setRecoveries] = useState(0)
  const [active, setActive] = useState(0)

  const mapContainerRef = useRef()

  const [latitude, setLatitude] = useState(0)
  const [longtitude, setLongtitude] = useState(0)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longtitude, latitude],
      zoom: 3
    })
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    const marker = new mapboxgl.Marker()
    .setLngLat([longtitude, latitude])
    .addTo(map)

    return() => map.remove()
  }, [latitude, longtitude])

    let total = 0
    countriesStats.forEach(country => {
      total += toNum(country.cases)
    })
     const globalTotal = {
      cases: numberWithCommas(total),
    }

    function search(e){
        e.preventDefault()
        let skorea = "South Korea"
        if(targetCountry === skorea.toLocaleLowerCase()){
          setTargetCountry("Suggested keyword S. Korea")
        }
        const match = countriesStats.find(country => country.country_name.toLowerCase() === targetCountry.toLowerCase())
        if(match){
          setName(match.country_name)
          setCases(toNum(match.cases))
          setCriticals(toNum(match.serious_critical))
          setDeaths(toNum(match.deaths))
          setRecoveries(toNum(match.total_recovered))
          setActive(toNum(match.active_cases))
          setTargetCountry("")
          console.log(match)

          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${targetCountry}.json?access_token=${process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_KEY}`)
          .then(res => res.json())
          .then(data => {
            setLongtitude(data.features[0].center[0])
            setLatitude(data.features[0].center[1])
          })

        }else{
          alert("Sorry not found. Check the keyword!")
        }
    }
    return(
        <React.Fragment>
        <Jumbotron className="mt-4 index">
        <Row>
          <Col lg={4} sm={12}>
            <Card className="p-4">
            <h4 className=" p-0 mb-0">{globalTotal.cases}</h4>
            <p className=" p-0">World Wide</p> 
            </Card>
          </Col>
          <Col lg={8} sm={12}>
          <Form onSubmit={e => search(e)}>
            <Form.Group controlId="country">
                <Form.Control type="text" placeholder="search for country" value={targetCountry} onChange={e => setTargetCountry(e.target.value)} required/>
            </Form.Group>
            <Button variant="primary" type="submit">Search</Button>
        </Form>
          </Col>
        </Row>
        </Jumbotron>
        
        <h1>Country: {name} </h1>
        <p className="mb-0"> Get Covid-19 stats of search country.</p>
        <Card className="p-3 shadow my-4">
        <Row className="m-0 p-0 bg-light">
          <Col sx={12} md={6} >
          <DoughnutChart updated={data.statistic_taken_at} cases={cases} criticals={criticals} deaths={deaths} recoveries={recoveries} active={active}/>
          <Row className="m-0 mb-3">
            <Col className="p-1 ">
              <Card className="p-2 text-center one text-white">
              <h6 className=" p-0 mb-0">{numberWithCommas(active)}</h6>
              <small className="mb-0 p-0">Active</small> 
              </Card>
            </Col>
            <Col className="p-1 ">
              <Card className="p-2 text-center two">
              <h6 className=" p-0 mb-0">{numberWithCommas(deaths)}</h6>
              <small className="mb-0 p-0">Criticals</small> 
              </Card>
            </Col>
            <Col className="p-1 ">
              <Card className="p-2 text-center three">
              <h6 className=" p-0 mb-0">{numberWithCommas(deaths)}</h6>
              <small className="mb-0 p-0">Deaths</small> 
              </Card>
            </Col>
            <Col className="p-1">
              <Card className="p-2 text-center  four">
              <h6 className=" p-0 mb-0">{numberWithCommas(recoveries)}</h6>
              <small className="mb-0 p-0">Recovered</small> 
              </Card>
            </Col>
            <Col className="p-1">
              <Card className="p-2 text-center six">
              <h6 className=" p-0 mb-0">{numberWithCommas(cases)}</h6>
              <small className="mb-0 p-0">Total Cases</small> 
              </Card>
            </Col>
          </Row>
       
          
        
          </Col>

          <Col sx={12} md={6} className="p-0 shadow">
            <div className="mapContainer" ref={mapContainerRef} />
          </Col>
        </Row>
        </Card>
       
        </React.Fragment>
    )
}
// ito ginagawa pag nagtawag ng data sa ibang api
export async function getStaticProps(){
  const res = await fetch('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      "x-rapidapi-key": "a4d1a76a25mshe13d3648a521ee0p165f27jsn7622774b722c"
    }
  })
    const data = await res.json()
    return{
      props: {
        data
      }
    }
}

