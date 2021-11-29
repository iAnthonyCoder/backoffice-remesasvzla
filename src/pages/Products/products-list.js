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
    getProducts,
    addNewProduct,
    updateProduct,
    deleteProduct
} from "store/products/actions"
import _, { isEmpty, size, map } from "lodash"
import DeleteDialog from '../../components/Common/DeleteDialog'
import ModalProductForm from "./modal-product-form";
import { productService } from "services";

const ProductsList = props => {
    const { products, onGetProducts } = props
    const [productToEdit, setProductToEdit] = useState([])
    const [modal, setModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const [scopedItem, setScopedItem] = useState({})
    const [actionsLoading, setActionsLoading] = useState(false)
    const [openFormModal, setOpenFormModal] = useState(false)


    const pageOptions = {
        sizePerPage: 50,
        totalSize: props.totalSize,
        // onPageChange: onPageChange,
        custom: true,
        page: Math.ceil(props.from/50)
    }
 

    const defaultSorted = [{
        dataField: '_id', // if dataField is not match to any column you defined, it will be ignored.
        order: 'desc' // desc or asc
    }];


    const changeStatus = async (_id, params) => {
        try {
            console.log(params)
            const updateProduct = {
                currency_to_deliver: params.currency_to_deliver,
                currency_to_receive: params.currency_to_receive,
                isPublished: !params.isPublished,
                _id: params._id,
                url: params.url,
                cash_deliver: params.cash_deliver
            }
            console.log(updateProduct)
            props.onUpdateProduct(updateProduct)
        } catch (er) {
            console.log(er)
        }
    }


    const productListColumns = [
        {
            text: "id",
            dataField: "_id",
            hidden: true,
            formatter: (cellContent, product) => (
                <>
                    {product.id}
                </>
            ),
        },
        {
            dataField: "currency_to_receive.iso_code",
            text: "Currency To Receive",
        },
        {
            dataField: "currency_to_deliver.iso_code",
            text: "Currency To Deliver",
            formatter: (cellContent, row) => (<>{cellContent}{cellContent ? <>&nbsp;</> : ''}<span className={`${row.cash_deliver ? 'font-size-12 badge-soft-primary badge badge-primary badge-pill' : 'danger'}`}>{row.cash_deliver && 'EFE'}</span></>)
        },
        {
            dataField: "url",
            text: "URL",
        },
        {
            dataField: "isPublished",
            text: "Published",
            formatter: (cellContent, row) => (
                <>
                    <div
                          className="form-check form-switch"
                          
                        >
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizesm"
                            checked={row.isPublished}
                            // onClick={() => {
                            //   this.setState({
                            //     toggleSwitchSize: !this.state
                            //       .toggleSwitchSize,
                            //   })
                            // }}
                            onClick={e => {
                              changeStatus(row._id, {...row})
                            }}
                          />
                          <label
                            className={`form-check-label ${row.isPublished ? 'text-primary' : 'text-danger'}`}
                            htmlFor="customSwitchsizesm"
                          >
                              {
                                  row.isPublished ? 'Published' : 'Unpublished'
                              }
                          
                          </label>
                    </div>
                </>
            )
        },
        {
            dataField: "menu",
            isDummyField: true,
            editable: false,
            text: "Action",
            formatter: (cellContent, product) => (
                <div className="d-flex gap-3">
                    <Link className="text-success" to="#"><i className="mdi mdi-pencil font-size-18" id="edittooltip" onClick={() => handleProductClick(product)}></i></Link>
                    <Link className="text-danger" to="#"><i className="mdi mdi-delete font-size-18" id="deletetooltip" onClick={() => openDeleteDialog(product)}></i></Link>
                </div>
            ),
        },
    ]

    useEffect(() => {
        if (products && !products.length) {
            onGetProducts(window.location.search);
            setIsEdit(false)
        }
    }, [onGetProducts, products.from, window.location.search]);



    const toggle = () => {
        setModal(!modal)
    }

    const handleProductClick = arg => {
        setShowError(false)
        const product = arg
        setProductToEdit({
            _id: product._id,
            currency_to_receive: product.currency_to_receive,
            currency_to_deliver: product.currency_to_deliver,
            cash_deliver: product.cash_deliver,
            url: product.url,
            isPublished: product.isPublished,
        })

        setIsEdit(true)
        setOpenFormModal(true)
        setModal(true)
    }

    const openDeleteDialog = (product) => {
        toggleDeleteModal()
        setScopedItem({
            _id: product._id,
            name: product.name
        })
    }

    const handleDeleteProduct = () => {
        setActionsLoading(true)
        const { onDeleteProduct } = props
        onDeleteProduct(scopedItem)
    }


    const handleValidProductSubmit = (e, values) => {
        setActionsLoading(true)
        setShowError(true)
        const { onAddNewProduct, onUpdateProduct } = props
        if (isEdit) {
            const updateProduct = {
                _id: values._id,
                currency_to_receive: values.currency_to_receive,
                currency_to_deliver: values.currency_to_deliver,
                cash_deliver: values.cash_deliver,
                url: values.url,
                isPublished: values.isPublished,
            }
            onUpdateProduct(updateProduct)
        } else {
            const newProduct = {
                currency_to_receive: values["currency_to_receive"],
                currency_to_deliver: values["currency_to_deliver"],
                cash_deliver: values["cash_deliver"],
                isPublished: values["isPublished"],
                url: values.url,
            }
            onAddNewProduct(newProduct)
        }
    }

    useEffect(() => {
        if(openFormModal){
            if(_.isEmpty(props.error)){
                setOpenFormModal(false)
                setIsEdit(false)
                setProductToEdit({})
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
    }, [products, props.error])

    const handleProductClicks = () => {
        setOpenFormModal(true)
        setIsEdit(false)
        setProductToEdit({})
        setShowError(false)
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
                handleDelete={handleDeleteProduct}
                actionsLoading={actionsLoading}
            />
            <ModalProductForm 
                isOpen={openFormModal}
                isEdit={false}
                toggle={()=>setOpenFormModal(false)}
                handleValidProductSubmit={handleValidProductSubmit}
                productToEdit={productToEdit}
                isEdit={isEdit}
                error={props.error}
                showError={showError}
                actionsLoading={actionsLoading}
                setActionsLoading={setActionsLoading}
            />
            <div className="page-content">
                <MetaTags>
                    <title>Product List | Skote - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Contacts" breadcrumbItem="Product List" />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <PaginationProvider
                                      pagination={paginationFactory(pageOptions)}
                                      keyField='_id'
                                      columns={+productListColumns}
                                      data={products}
                                    >
                                        {({ paginationProps, paginationTableProps }) => (
                                            <ToolkitProvider
                                              keyField="_id"
                                              data={products}
                                              columns={productListColumns}
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
                                                                        onClick={handleProductClicks}
                                                                    >
                                                                        <i className="mdi mdi-plus-circle-outline me-1" />
                                                                        Create New Product
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
                                                                </div>
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

ProductsList.propTypes = {
    products: PropTypes.array,
    onGetProducts: PropTypes.func,
    onAddNewProduct: PropTypes.func,
    onDeleteProduct: PropTypes.func,
    onUpdateProduct: PropTypes.func
}

const mapStateToProps = ({ products }) => ({
    products: products.products,
    totalSize: products.totalSize,
    from: products.from,
    error: products.error
})

const mapDispatchToProps = dispatch => ({
    onGetProducts: (query) => dispatch(getProducts(query)),
    onAddNewProduct: product => dispatch(addNewProduct(product)),
    onUpdateProduct: product => dispatch(updateProduct(product)),
    onDeleteProduct: product => dispatch(deleteProduct(product)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ProductsList))
