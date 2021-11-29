import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import MetaTags from 'react-meta-tags';
import queryString from 'query-string'
import {
  Container,
} from "reactstrap"
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"


// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider from 'react-bootstrap-table2-toolkit';

//Import Breadcrumb
import "./datatables.scss"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"
import _ from 'lodash';
import moment from 'moment';
import { productService, refreshService } from 'services';


const Dashboard = props => {

    const [ columns, setColumns ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ initialized, setInitialized ] = useState(false)
    const [ history, setHistory ] = useState([])
    const [productData, setProductData] = useState([])

    const _getProducts = async () => {
    
        try {
            setLoading(true)
            let products = await productService.list()
            let _columns = [...products.totalData.sort((a, b) => a.currency_to_receive.iso_code.toLowerCase() > b.currency_to_receive.iso_code.toLowerCase() ? 1 : -1).map((x, i) => {
                return {
                    key:i,
                    dataField:`${x.currency_to_receive.iso_code}/${x.currency_to_deliver.iso_code}${x.cash_deliver ? ' (EFE)' : ''}`,
                    text:<span><i className={`mdi mdi-circle ${x.isPublished ? 'text-primary' : 'text-danger'} me-1`}/>{" "}{`${x.currency_to_receive.iso_code}/${x.currency_to_deliver.iso_code}${x.cash_deliver ? ' (EFE)' : ''}`}</span>,
                    sort:false,
                    _id: x._id
                }
            })]

            setColumns([{
                dataField: 'date',
                text: 'Date',
                formatter: (cellContent) => cellContent.toString().replace('T', ' ').replaceAll('-', '/').substr(0, cellContent.toString().indexOf('.'))
            },..._columns])

            getProductData()

            let queryS = {
              size: 50,
              sort_field: 'date',
              sort_order: 'asc',
              filter_field: ['date', 'date'],
              filter_type: ['gte', 'lte'],
              filter_value: [startDate, endDate],
            }

            const history = await refreshService.list('?'+ queryString.stringify(queryS, {
                arrayFormat:'bracket'
            }))
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
            const products = await productService.list()
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
        try {
            if((pageOptions.totalSize > pageOptions.starting_at && initialized)){ 
                setLoading(true)
                const res = await refreshService.list(`?size=50&starting_at=${parseInt(pageOptions.starting_at, 10)+parseInt(pageOptions.sizeToFetch, 10)}&sort_field=date&sort_order=desc`)
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
  

    const [ startDate, setStartDate ] = React.useState(moment().subtract(7, 'days').format('yyyy-MM-DD'))
    const [ endDate, setEndDate ] = React.useState(moment().format('yyyy-MM-DD'))
    useEffect(() => {
        _getProducts()
    }, [startDate, endDate])

    if(!columns.length > 0) return 'Loading...'
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | Skote - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    <Breadcrumbs
                        title={props.t("Dashboards")}
                        breadcrumbItem={props.t("Dashboard")}
                    />
                    <React.Fragment>
                        <Card>
                            <CardBody>
                                <div className='d-flex align-items-between w-100'>
                                    <div>
                                        <CardTitle className="h4">Rate History</CardTitle>
                                        <p className="card-title-desc">Range {moment.duration(moment(endDate).utc(0).add(2, 'days').startOf('day').diff(moment(startDate).utc(0).endOf('day'))).humanize(true).replace('in ', '')}</p>
                                    </div>
                                    <div style={{marginLeft:'auto'}}>
                                        <div className="d-flex align-items-center">
                                            <input type='date' value={startDate} onChange={(e)=>setStartDate(e.target.value)} className='form-control mr-2'></input><span style={{paddingRight:'.5rem', paddingLeft:'.5rem'}}>-</span> 
                                            <input type='date' value={endDate} onChange={(e)=>setEndDate(e.target.value)} className='form-control ml-2'></input>
                                        </div>
                                    </div>
                                </div>
                                <PaginationProvider
                                    pagination={paginationFactory(pageOptions)}
                                    keyField='id'
                                    columns={columns}
                                    data={productData}
                                >
                                    {({ paginationProps, paginationTableProps }) => (
                                        <ToolkitProvider
                                          keyField='_id'
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
                                                                    keyField={"_id"}
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
                                                </React.Fragment>
                                            )}
                                        </ToolkitProvider>
                                    )}
                                </PaginationProvider>
                                {
                                    loading && (
                                        <div className='d-flex w-100 mt-4 justify-content-center'>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div> 
                                    )
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
