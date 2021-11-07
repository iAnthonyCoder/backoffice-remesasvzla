import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import MetaTags from 'react-meta-tags';
import {


  
  Button,

  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
  Table,
  Container,
} from "reactstrap"
import { Link, useLocation, useHistory } from "react-router-dom"

//import Charts


import modalimage1 from "../../assets/images/product/img-7.png"
import modalimage2 from "../../assets/images/product/img-4.png"

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"


// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

//Import Breadcrumb
import "./datatables.scss"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"
import _, { set } from 'lodash';
import { getHistory, getProducts } from 'helpers/fakebackend_helper';
import { tSExternalModuleReference } from '@babel/types';
import moment from 'moment';


const Dashboard = props => {

  const location = useLocation();

  const [ columns, setColumns ] = useState([])

  const [ products, setProducts ] = useState([])

  const [ loading, setLoading ] = useState(true)

  const [ initialized, setInitialized ] = useState(false)

  const [ history, setHistory ] = useState([])

  const _history = useHistory()

  
  const _getProducts = async () => {
    try {
      setLoading(true)
      const products = await getProducts()
      let _columns = [...products.totalData.map(x => {
        return {
          dataField:`${x.currency_to_receive.iso_code}/${x.currency_to_deliver.iso_code}${x.cash_deliver ? ' (EFE)' : ''}`,
          text:`${x.currency_to_receive.iso_code}/${x.currency_to_deliver.iso_code}${x.cash_deliver ? ' (EFE)' : ''}`,
          sort:false,
          _id: x._id
        }
      })]
      setColumns([{
        dataField: 'date',
        text: 'Date',
        // sort: true,
        formatter: (cellContent) => cellContent.toString().replace('T', ' ').replaceAll('-', '/').substr(0, cellContent.toString().indexOf('.'))
      },..._columns])
      setProducts(products.totalData)
      getProductData()
      const history = await getHistory('?size=50&sort_field=date&sort_order=desc')
      setHistory(history.data)
      setInitialized(true)
      setPageOptions({...pageOptions, totalSize: history.total, starting_at: history.starting_at})
      setLoading(false)
    } catch (er){
      console.log(er)
    }
  }

  const getProductData = async () => {
    try {
      const products = await getProducts()
      let _data = [{'date':1}]
      products.totalData.map(x => {
        _data[0][x.name] = x.rate
      })
      setProductData(_data)
      
    } catch (er){
      console.log(er)
    }
  }

  const fetchMore = async () => {
    console.log(pageOptions)
    try {
      if((pageOptions.totalSize > pageOptions.starting_at && initialized)){
       
        setLoading(true)
        const res = await getHistory(`?size=50&starting_at=${parseInt(pageOptions.starting_at, 10)+parseInt(pageOptions.sizeToFetch, 10)}&sort_field=date&sort_order=desc`)

        let newData = history.concat(res.data)
        setHistory(newData)
        setPageOptions({...pageOptions, totalSize: res.total, starting_at: res.starting_at, sizePerPage: newData.length})
        setLoading(false)
      }
    } catch(er) {
      console.log(er)
    }

  }


  useEffect(() => {
    _getProducts()
  }, [])

  const [productData, setProductData] = useState([
    { "date": 1},

    { "date": 2},

    { "date": 3}
  ])


  const [pageOptions, setPageOptions] = useState({
    sizeToFetch: 50,
    sizePerPage: 50,
    totalSize: productData.length,
    starting_at: 0,
    custom: true,
  })

  useEffect(() => {
    const onScroll = function () {
       if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          
            fetchMore()
          
       }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
 }, [pageOptions])
  


  // Table Data


 

  // Custom Pagination Toggle
  const sizePerPageList = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '15', value: 15 },
    { text: '20', value: 20 },
    { text: '25', value: 25 },
    { text: 'All', value: (productData).length }];


  // Select All Button operation
  const selectRow = {
    mode: 'checkbox'
  }

  const initialValuesCreator = (products) => {
      let initialValues = {}
      products.map(x => initialValues[x._id] = 0)
      return initialValues
    
  }

  const [ openFormModal, setOpenFormModal ] = useState(false)
  const [ actionsLoading, setActionsLoading ] = useState(false)

  if(!columns.length > 0) return 'Loading...'
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


    <React.Fragment>
     
              <Card>
                <CardBody>
                  <div>
                    <CardTitle className="h4">Rate History</CardTitle>
                    <p class="card-title-desc">Data from the Google Sheet</p>
                    {/* <button onClick={()=>setOpenFormModal(true)} className='btn btn-primary'>Update all</button> */}
                    {/* <button onClick={()=>setOpenFormModal(true)} className='btn btn-primary'><i className='bx bx-spreadsheet mr-1'></i>&nbsp;Update from sheet</button> */}
                  </div>
                  {console.log(history)}
                  <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                    keyField='id'
                    columns={columns}
                    data={productData}
                  >
                    {({ paginationProps, paginationTableProps }) => (
                      <ToolkitProvider
                        keyField='id'
                        columns={columns}
                        data={history}
                        search
                      >
                        {toolkitProps => (
                          <React.Fragment>

                           

                            <Row>
                              <Col xl="12">
                                <div className="table-responsive" id='mapping_table'>
                                  <BootstrapTable
                                    keyField={"id"}
                                    responsive
                                    bordered={true}
                                    striped={false}
                                    // defaultSorted={defaultSorted}
                                    
                                    classes={
                                      "table align-middle table-nowrap"
                                    }
                                    headerWrapperClasses={"thead-light"}
                                    {...toolkitProps.baseProps}
                                    {...paginationTableProps}
                                  />

                                </div>
                              </Col>
                            </Row>

                            {/* <Row className="align-items-md-center mt-30">
                              <Col className="inner-custom-pagination d-flex">
                                <div className="d-inline">
                                  <SizePerPageDropdownStandalone
                                    {...paginationProps}
                                  />
                                </div>
                                <div className="text-md-right ms-auto">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </div>
                              </Col>
                            </Row> */}
                          </React.Fragment>
                        )
                        }
                      </ToolkitProvider>
                    )
                    }</PaginationProvider>
                  {
                   loading && <div className='d-flex w-100 mt-4 justify-content-center'>
                   <div className="spinner-border" role="status">
                 <span class="sr-only">Loading...</span>
               </div>
                </div> 
                  }
                </CardBody>
              </Card> 
          
    </React.Fragment>
 

          

        </Container>
      </div>

    </React.Fragment>
  )
}

Dashboard.propTypes = {
  t: PropTypes.any
}

export default withTranslation()(Dashboard)
