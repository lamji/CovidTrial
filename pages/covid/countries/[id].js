import toNum from '../../../toNum'
import DoughnutChart2 from '../../../components/LineChart'
import Banner from '../../../components/Banner'
import {Row, Col, Card} from 'react-bootstrap'
import GlobalMap from '../../../components/GlobalMap'

export default function country({country}){
  console.log(country)
    return(
        <React.Fragment>
        <Card className="my-5 p-4">
          <Row>
            <Col sm={12} lg={6}>
              <Banner country={country.country_name} cases={country.cases} deaths={country.deaths} criticals={country.serious_critical} recoveries={country.total_recovered} />
            </Col>
            <Col className="p-3" sm={12} lg={6}>
              <DoughnutChart2  cases={toNum(country.cases)} criticals={toNum(country.serious_critical)} deaths={toNum(country.deaths)} recoveries={toNum(country.total_recovered)}/> 
            </Col>
          </Row>
          <Card>
            <GlobalMap country={country.country_name} />
          </Card>
        </Card>
        </React.Fragment>
    )
}

export async function getStaticPaths(){
    const res = await fetch('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": "a4d1a76a25mshe13d3648a521ee0p165f27jsn7622774b722c"
      }
    })
    const data = await res.json()

    const paths = data.countries_stat.map(country => ({
        params: {id: country.country_name.replace( /\s/g, '')}
    }))
    return{ paths, fallback: false}
}


// ito ginagawa pag nagtawag ng data sa ibang api
export async function getStaticProps({params}){
    const res = await fetch('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": "a4d1a76a25mshe13d3648a521ee0p165f27jsn7622774b722c"
      }
    })
        const data = await res.json()
        const country = data.countries_stat.find(country => country.country_name.replace( /\s/g, '') === params.id)

      return{
        props: {
          country
        }
      }
  }