import { Card, CardBody, Col, Container, Row, Modal, Button, ModalHeader, ModalBody, Alert } from "reactstrap"
import moment from 'moment';
import React from 'react'
import _ from "lodash";
import {
   
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
  } from "reactstrap"
  import classnames from "classnames"
  import BootstrapTable from 'react-bootstrap-table-next';
import Swal from "sweetalert2";
import showNotifications from "components/Common/Notifications";
import { refreshService } from "services";
import queryString from 'query-string'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
})

const UpdateRatesFromSheetModal = (props) => {

  

    const [ actionsLoading, setActionsLoading ] = React.useState(false)
    const [ dataFromSheet, setDataFromSheet ] = React.useState(false)

    const _getSheetData = async () => {
        try {
            let query = Object.assign({}, formData)

            query.day = parseInt(query.day, 10)
            query.month = parseInt(query.month, 10)
            query.year = parseInt(query.year, 10)
         
            if(query.day < 10){
                query.day = '0'+query.day
            }
            if(query.month < 10){
                query.month = '0'+query.month
            }
            console.log(query)
            let res = await refreshService.getFromSheet('?'+queryString.stringify(query))
            setDataFromSheet(res)
            setActionsLoading(false)
        } catch(er){
            console.log(er)
            showNotifications({
                
                title:er.response.data.message, 
                type:'error'
            })
            setActionsLoading(false)
        }

    }

    const submitData = async (data) => {
        
        try {
            setActionsLoading(true)
            let payload = {
                date: data.date,
                rates: data.rates.map(x => {
                    return {
                        product:x.product,
                        value: parseFloat(x.value.replaceAll('.', '').replace(',', '.'))
                    }
                })
            }
            const response = await refreshService.create(
                payload
            )
            if(response.ok){
                setActionsLoading(false)
                setDataFromSheet(dataFromSheet.filter(x => x.date!=payload.date))
                props.toggle()
                // props._getProducts()
                if(response.updated){
                    showNotifications({
                        title:'Rates updated', 
                        type:'success'
                    })
                } else {
                    showNotifications({
                        title:'Rates imported', 
                        type:'success'
                    })
                }
            }
            
        } catch(er) {
            setActionsLoading(false)
            showNotifications({
                title:er.response.data.message, 
                type:'error'
            })
        }
    }

    React.useEffect(() => {
        if(dataFromSheet.length > 0){
            setActiveTab(dataFromSheet[0].date.substr(dataFromSheet[0].date.indexOf('T')+1, (dataFromSheet[0].date.length - dataFromSheet[0].date.indexOf('T')-1)))
        }
    }, [dataFromSheet])

    const [ formData, setFormData ] = React.useState({
        day: moment().format("D"),
        month: moment().format("M"),
        year: moment().format("YYYY"),
    })

    const [ activeTab, setActiveTab ] = React.useState('1')
   
    return (
        <Modal
            isOpen={props.isOpen} 
            toggle={props.toggle}
        > 
            <ModalHeader toggle={props.toggle} tag="h4">
                Update rates from google shet
            </ModalHeader>
            <ModalBody> 
           
                {
                    (!_.isEmpty(dataFromSheet) && dataFromSheet[0].rates.length > 0) ? (
                        <>
                            <Nav  tabs>
                                {
                                    dataFromSheet.map((x) => <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                              active: activeTab === x.date.substr(x.date.indexOf('T')+1, (x.date.length - x.date.indexOf('T')-1)),
                                            })}
                                            onClick={() => {
                                              setActiveTab(x.date.substr(x.date.indexOf('T')+1, (x.date.length - x.date.indexOf('T')-1)))
                                            }}
                                        >
                                            {x.date.substr(x.date.indexOf('T')+1, (x.date.length - x.date.indexOf('T')-1))}
                                        </NavLink>
                                    </NavItem>)
                                }
                            </Nav>
                            <TabContent activeTab={activeTab} className="pt-2 text-muted">
                            {
                                dataFromSheet.map( x =>
                                    <TabPane tabId={x.date.substr(x.date.indexOf('T')+1, (x.date.length - x.date.indexOf('T')-1))}>
                                      
                                            {/* x.rates.map( y => <Col sm="12"><span><strong>{y.pair}</strong>:</span><span> {y.value}</span></Col>) */}

                                            
                                            <div className="table-responsive">
                                  <BootstrapTable
                                    keyField={"id"}
                                    responsive
                                    bordered={true}
                                    striped={false}
                                   
                                    columns = {[{
                                        dataField: 'pair',
                                        text: 'Pair'
                                      }, {
                                        dataField: 'value',
                                        text: 'Price'
                                      }]}
                                      data={
                                        x.rates.map( y => ({pair:y.pair, value:y.value}))
                                      }
                                    classes={
                                      "table align-middle table-nowrap"
                                    }
                                    headerWrapperClasses={"thead-light"}
                                   
                                  />

                                </div>
                                     <button disabled={actionsLoading} onClick={()=>submitData(x)} className='btn btn-primary w-100'>
                                        {actionsLoading ? <span className="spinner-border spinner-border-sm mr-1"></span> : 'Add to database'}
                                        
                                         </button>
                                    </TabPane>
                                )
                            }
                            </TabContent>
                        
                        </>
                    ) : (
                        <>
                             <div className='row'>
                                 {console.log(formData)}
                                <div className='col-4'>
                                    <div className="form-group">
                                        <label for='day' className="form-label">Day</label>
                                        <select name='day' className='form-control' onChange={(e)=>setFormData({...formData, day:e.target.value})} value={parseInt(formData.day, 10)}>
                                            {
                                                Array.from({length: moment().daysInMonth()}, (v, k) => k + 1).map((x, i) => <option value={x}>
                                                    {i+1}
                                                </option>)
                                            }
                                        </select>
                                    </div>
                                    <br/>
                                </div>
                                <div className='col-4'>
                                    <div className="form-group">
                                        <label for='month' className="form-label">Month</label>
                                        <select name='month' className='form-control' onChange={(e)=>setFormData({...formData, month:e.target.value})} value={parseInt(formData.month, 10)}>
                                            {
                                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(x => <option value={x}>
                                                    {x}
                                                </option>)
                                            }
                                        </select>
                                        
                                        {/* <input type='number' name='month' className='form-control' readOnly={true} value={formData.month}></input> */}
                                        
                                    </div>
                                    <br/>
                                </div>
                                <div for='year' className='col-4'>
                                    <div className="form-group">
                                        <label for='year' className="form-label">Year</label>
                                        <select name='year' className='form-control' onChange={(e)=>setFormData({...formData, year:e.target.value})} value={parseInt(formData.year, 10)}>
                                            {
                                                [parseInt(formData.year, 10)-1, parseInt(formData.year, 10), parseInt(formData.year, 10)+1].map(x => <option value={x}>
                                                    {x}
                                                </option>)
                                            }
                                        </select>
                                    </div>
                                    <br/>
                                </div>
                            </div>
                           
                            <button type='button' disabled={actionsLoading} onClick={()=>{
                                setActionsLoading(true)
                                _getSheetData()
                            }} className='btn w-100 btn-block btn-primary'>{actionsLoading ? <span className="spinner-border spinner-border-sm mr-1"></span> : 'Get sheet data'}</button>
                        </>
                    )
                }   
               
            </ModalBody>
        </Modal>
    )
}

export default UpdateRatesFromSheetModal