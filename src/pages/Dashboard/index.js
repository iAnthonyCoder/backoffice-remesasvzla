import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
  Table,
} from "reactstrap"
import { Link } from "react-router-dom"

//import Charts
import StackedColumnChart from "./StackedColumnChart"

import modalimage1 from "../../assets/images/product/img-7.png"
import modalimage2 from "../../assets/images/product/img-4.png"

// Pages Components
import WelcomeComp from "./WelcomeComp"
import MonthlyEarning from "./MonthlyEarning"
import SocialSource from "./SocialSource"
import ActivityComp from "./ActivityComp"
import TopCities from "./TopCities"
import LatestTranaction from "./LatestTranaction"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"
import { getCurrencies, getProducts } from 'helpers/fakebackend_helper';
import _ from 'lodash';
import BuySell from 'pages/Dashboard-crypto/buy-sell';


const Dashboard = props => {

  let [ data, setData ] = useState([])
  let [ currencyFrom, setCurrencyFrom ] = useState()
  let [ currencyTo, setCurrencyTo ] = useState()
  const [ amount, setAmount ] = useState(1)

  const getData = async () => {
    try {
      const newData = await getProducts()
      setData(newData)
    } catch(er) {
      console.log(er)
    }
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Dashboard | Skote - React Admin & Dashboard Template</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />

          <BuySell />

          <input className='form-control' type='number' value={amount} onChange={(e)=>setAmount(e.target.value)} /> 
          <br />
          {
            data && data.totalData && data.totalData.length > 0 && (
              <select onChange={(x)=>setCurrencyFrom(x.target.value)} className='form-control'>
                <option>select</option>
                {
                  data.totalData.map(x => <option value={x.currency_to_receive._id}>{x.currency_to_receive.iso_code}</option>)
                }
              </select>
            )
          }
          <br />
          {
            !_.isEmpty(currencyFrom) && (
              <>
                <select onChange={(x)=>setCurrencyTo(x.target.value)} className='form-control'>
                <option>select</option>
                  {
                    data.totalData.filter(x => x.currency_to_receive._id === currencyFrom).map(x => <option value={x.currency_to_deliver._id}>{x.currency_to_deliver.iso_code}</option>)
                  }
                </select>
              </>
            )
          }
          {
            (!_.isEmpty(currencyFrom) && currencyFrom.length > 10 && !_.isEmpty(currencyTo) && currencyTo.length > 10 ) && (
              <h1>{data.totalData.find(x => x.currency_to_deliver._id === currencyTo && x.currency_to_receive._id === currencyFrom).rate * amount} {data.totalData.find(x => x.currency_to_deliver._id === currencyTo && x.currency_to_receive._id === currencyFrom).currency_to_deliver.iso_code}</h1>
            )
          }

        </Container>
      </div>

    </React.Fragment>
  )
}

Dashboard.propTypes = {
  t: PropTypes.any
}

export default withTranslation()(Dashboard)
