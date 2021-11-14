import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import MetaTags from 'react-meta-tags';
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"
import { Card, CardBody, Col, Container, Row, Modal, Button, ModalHeader, ModalBody, Alert } from "reactstrap"
import
paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator"
import { AvForm, AvField } from "availity-reactstrap-validation"
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"
import BootstrapTable from "react-bootstrap-table-next"

import showNotification from '../../components/Common/Notifications'
import Breadcrumbs from "components/Common/Breadcrumb"

import {
    getCurrencies,
    addNewCurrency,
    updateCurrency,
    deleteCurrency
} from "store/currencies/actions"
import _, { isEmpty, size, map } from "lodash"
import DeleteDialog from '../../components/Common/DeleteDialog'

const CurrenciesList = props => {
    const { currencies, onGetCurrencies } = props
    const [modal, setModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const [scopedItem, setScopedItem] = useState({})
    const [actionsLoading, setActionsLoading] = useState(false)


    // const onPageChange = (page, sizePerPage) => {
    //     props.history.push(window.location.pathname+'?page='+page)
    // }

    const pageOptions = {
        sizePerPage: 20,
        totalSize: props.totalSize, // replace later with size(currencies),
        // onPageChange: onPageChange,
        custom: true,
        page: Math.ceil(props.from/20)
    }
 

    const defaultSorted = [{
        dataField: '_id', // if dataField is not match to any column you defined, it will be ignored.
        order: 'desc' // desc or asc
    }];

  

    const currencyListColumns = [
        {
            text: "id",
            dataField: "_id",
            sort: true,
            hidden: true,
            formatter: (cellContent, currency) => (
                <>
                    {currency.id}
                </>
            ),
        },
        {
            text: "Name",
            dataField: "name",
            sort: true
        },
        {
            text: "Symbol",
            dataField: "symbol",
            sort: true
        },
        {
            text: "Country",
            dataField: "country",
            sort: true,
        },
        {
            text: "Country Code",
            dataField: "country_code",
            sort: true,
        },
        {
            dataField: "iso_code",
            text: "Iso Code",
            sort: true,
        },

        // {
        //     dataField: "status",
        //     text: "Status",
        //     formatter: (cellContent, currency) => (
        //         <div className="d-flex gap-3">
        //             {
        //                 cellContent === 'ACTIVE' ? <span className='badge badge-soft-success rounded-pill float-end ms-1 font-size-12'>ACTIVE</span> 
        //                     : cellContent === 'INACTIVE' ? <span className='badge badge-soft-dark rounded-pill float-end ms-1 font-size-12'>INACTIVE</span> 
        //                     : <span className='badge badge-soft-warning rounded-pill float-end ms-1 font-size-12'>BANNED</span> 
        //             }
        //         </div>
        //     ),
        // },
        {
            dataField: "menu",
            isDummyField: true,
            editable: false,
            text: "Action",
            formatter: (cellContent, currency) => (
                <div className="d-flex gap-3">
                    <Link className="text-success" to="#"><i className="mdi mdi-pencil font-size-18" id="edittooltip" onClick={() => handleCurrencyClick(currency)}></i></Link>
                    <Link className="text-danger" to="#"><i className="mdi mdi-delete font-size-18" id="deletetooltip" onClick={() => openDeleteDialog(currency)}></i></Link>
                </div>
            ),
        },
    ]

    useEffect(() => {
        if (currencies && !currencies.length) {
            onGetCurrencies(window.location.search);
            setIsEdit(false)
        }
    }, [onGetCurrencies, currencies.from, window.location.search]);

    // useEffect(() => {

    //     onGetCurrencies(window.location.search);
    //     setIsEdit(false)
    
    // }, [window.location.search]);

    useEffect(() => {
        setIsEdit(false)
    }, [currencies])

    useEffect(() => {
        if (!isEmpty(currencies) && !!isEdit) {
            setIsEdit(false)
        }
    }, [currencies])

    const toggle = () => {
        setModal(!modal)
    }

    const [ currencyToEdit, setCurrencyToEdit ] = useState(false)

    const handleCurrencyClick = arg => {
        setShowError(false)
        const currency = arg
        setCurrencyToEdit({
            _id: currency._id,
            symbol: currency.symbol,
            iso_code: currency.iso_code,
            country: currency.country,
            country_code: currency.country_code,
            name: currency.name,
        })

        setIsEdit(true)

        setModal(true)
    }

    const openDeleteDialog = (currency) => {
        toggleDeleteModal()
        setScopedItem({
            _id: currency._id,
            name: currency.name
        })
    }

    const handleDeleteCurrency = () => {
        setActionsLoading(true)
        const { onDeleteCurrency } = props
        onDeleteCurrency(scopedItem)
    }


    const handleValidCurrencySubmit = (e, values) => {
        setActionsLoading(true)
        setShowError(true)
        const { onAddNewCurrency, onUpdateCurrency } = props
        if (isEdit) {
            const updateCurrency = {
                _id: currencyToEdit._id,
                symbol: values.symbol,
                iso_code: values.iso_code,
                country: values.country,
                country_code: values.country_code,
                name: values.name,
            }
            onUpdateCurrency(updateCurrency)
        } else {
            const newCurrency = {
                symbol: values["symbol"],
                iso_code: values["iso_code"],
                country: values["country"],
                country_code: values["country_code"],
                name: values["name"],
            }
            onAddNewCurrency(newCurrency)
        }
    }

    useEffect(() => {
        if(modal){
            if(_.isEmpty(props.error)){
                setModal(false)
                setIsEdit(false)
                showNotification({title:'Saved!', message:'Item is saved', type:'success'})
            }
        }
        if(deleteModalIsOpen){
            if(_.isEmpty(props.error)){
                toggleDeleteModal()
                showNotification({title:'Deleted!', message:'Item is gone', type:'success'})
            }
        }
        setActionsLoading(false)
    }, [currencies, props.error])

    const handleCurrencyClicks = () => {
        setShowError(false)
        setCurrencyToEdit(false)
        setIsEdit(false)
        toggle()
    }


    function toggleDeleteModal() {
        setDeleteModalIsOpen(!deleteModalIsOpen)
        removeBodyCss()
    }

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    return (
        <React.Fragment>
            <DeleteDialog 
                deleteModalIsOpen={deleteModalIsOpen}
                setDeleteModalIsOpen={setDeleteModalIsOpen}
                toggleDeleteModal={toggleDeleteModal}
                scopedItem={scopedItem}
                handleDelete={handleDeleteCurrency}
                actionsLoading={actionsLoading}
            />
            <div className="page-content">
                <MetaTags>
                    <title>Currency List | Skote - React Admin & Dashboard Template</title>
                </MetaTags>
           
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Contacts" breadcrumbItem="Currency List" />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <PaginationProvider
                                      pagination={paginationFactory(pageOptions)}
                                      keyField='_id'
                                      columns={+currencyListColumns}
                                      data={currencies}
                                    >
                                        {({ paginationProps, paginationTableProps }) => (
                                            <ToolkitProvider
                                              keyField="_id"
                                              data={currencies}
                                              columns={currencyListColumns}
                                              bootstrap4
                                              search
                                            >
                                                {toolkitProps => (
                                                    <React.Fragment>
                                                        <Row className="mb-2">
                                                            <Col sm="12">
                                                                <div className="text-sm-end">
                                                                    <Button
                                                                        color="primary"
                                                                        className="font-16 btn-block btn btn-primary"
                                                                        onClick={handleCurrencyClicks}
                                                                    >
                                                                        <i className="mdi mdi-plus-circle-outline me-1" />
                                                                        Create New Currency
                                                                    </Button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xl="12">
                                                                <div className="table-responsive">
                                                                    <BootstrapTable
                                                                        {...toolkitProps.baseProps}
                                                                        {...paginationTableProps}
                                                                        defaultSorted={defaultSorted}
                                                                        classes={
                                                                            "table align-middle table-nowrap table-hover"
                                                                        }
                                                                        remote
                                                                        onTableChange={
                                                                            (e)=>''
                                                                        }
                                                                        bordered={false}
                                                                        striped={false}
                                                                        responsive
                                                                    />

                                                                        <Modal
                                                                            isOpen={modal} toggle={toggle}
                                                                        >
                                                                            <ModalHeader toggle={toggle} tag="h4">
                                                                                {!!isEdit ? "Edit Currency" : "Add Currency"}
                                                                            </ModalHeader>
                                                                            <ModalBody>
                                                                                <AvForm
                                                                                    onValidSubmit={
                                                                                        handleValidCurrencySubmit
                                                                                    }
                                                                                    autoComplete="off"
                                                                                >
                                                                                <Row form>
                                                                                    <Col xs={12}>
                                                                                        {(!_.isEmpty(props.error) && showError) ? (
                                                                                            <Alert color="danger">{props.error.response.data.message ? props.error.response.data.message : props.error.response.data.errors[0].message}</Alert>
                                                                                        ) : null}
                                                                                        <div className="mb-3">
                                                                                            <AvField
                                                                                                name="name"
                                                                                                label="Name"
                                                                                                type="text"
                                                                                                autoComplete="off"
                                                                                                errorMessage="Invalid name"
                                                                                                validate={{
                                                                                                  required: { value: true },
                                                                                                }}
                                                                                                value={currencyToEdit.name || ""}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="mb-3">
                                                                                            <AvField
                                                                                                name="symbol"
                                                                                                label="Symbol"
                                                                                                type="text"
                                                                                                autoComplete="off"
                                                                                                errorMessage="Invalid symbol"
                                                                                                validate={{
                                                                                                  required: { value: true },
                                                                                                }}
                                                                                                value={currencyToEdit.symbol || ""}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="mb-3">
                                                                                            <AvField
                                                                                                name="country"
                                                                                                label="Country"
                                                                                                type="text"
                                                                                                autoComplete="off"
                                                                                                errorMessage="Invalid country"
                                                                                                validate={{
                                                                                                  required: { value: true },
                                                                                                }}
                                                                                                value={currencyToEdit.country || ""}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="mb-3">
                                                                                            <AvField
                                                                                                name="country_code"
                                                                                                label="Country Code"
                                                                                                type="text"
                                                                                                autoComplete="off"
                                                                                                errorMessage="Invalid Country Code"
                                                                                                validate={{
                                                                                                  required: { value: true },
                                                                                                }}
                                                                                                value={currencyToEdit.country_code || ""}
                                                                                            />
                                                                                        </div>
                                                                                       
                                                                                        <div className="mb-3">
                                                                                            <AvField
                                                                                                name="iso_code"
                                                                                                label="Iso Code"
                                                                                                type="text"
                                                                                                autoComplete="off"
                                                                                                errorMessage="Invalid Iso Code"
                                                                                                validate={{
                                                                                                  required: { value: true },
                                                                                                }}
                                                                                                value={currencyToEdit.iso_code || ""}
                                                                                            />
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <div className="text-end">
                                                                                            <button
                                                                                                type="submit"
                                                                                                className="btn btn-success save-currency"
                                                                                                disabled={actionsLoading}
                                                                                            >
                                                                                                {
                                                                                                    actionsLoading 
                                                                                                        ? <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                                                        : 'Save' 
                                                                                                }
                                                                                            </button>
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                            </AvForm>
                                                                        </ModalBody>
                                                                    </Modal>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row className="align-items-md-center mt-30">
                                                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                                <PaginationListStandalone
                                                                    {...paginationProps}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </React.Fragment>
                                                )}
                                            </ToolkitProvider>
                                        )}
                                    </PaginationProvider>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

CurrenciesList.propTypes = {
    currencies: PropTypes.array,
    onGetCurrencies: PropTypes.func,
    onAddNewCurrency: PropTypes.func,
    onDeleteCurrency: PropTypes.func,
    onUpdateCurrency: PropTypes.func
}

const mapStateToProps = ({ currencies }) => ({
    currencies: currencies.currencies,
    totalSize: currencies.totalSize,
    from: currencies.from,
    error: currencies.error
})

const mapDispatchToProps = dispatch => ({
    onGetCurrencies: (query) => dispatch(getCurrencies(query)),
    onAddNewCurrency: currency => dispatch(addNewCurrency(currency)),
    onUpdateCurrency: currency => dispatch(updateCurrency(currency)),
    onDeleteCurrency: currency => dispatch(deleteCurrency(currency)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(CurrenciesList))
