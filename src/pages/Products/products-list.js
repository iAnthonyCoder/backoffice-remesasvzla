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
import {
    getRoles
} from "../../helpers/fakebackend_helper"
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

const ProductsList = props => {
    const { products, onGetProducts } = props
    const [productList, setProductList] = useState([])
    const [productToEdit, setProductToEdit] = useState([])
    const [modal, setModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [roles, setRoles] = useState([]);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const [scopedItem, setScopedItem] = useState({})
    const [actionsLoading, setActionsLoading] = useState(false)
    const [openFormModal, setOpenFormModal] = useState(false)

    const { SearchBar } = Search

    const onPageChange = (page, sizePerPage) => {
        props.history.push(window.location.pathname+'?page='+page)
    }

    const pageOptions = {
        sizePerPage: 20,
        totalSize: props.totalSize, // replace later with size(products),
        onPageChange: onPageChange,
        custom: true,
        page: Math.ceil(props.from/20)
    }
 

    const defaultSorted = [{
        dataField: '_id', // if dataField is not match to any column you defined, it will be ignored.
        order: 'desc' // desc or asc
    }];

    const selectRow = {
        mode: 'checkbox'
    };

    const productListColumns = [
        {
            text: "id",
            dataField: "_id",
            sort: true,
            hidden: true,
            formatter: (cellContent, product) => (
                <>
                    {product.id}
                </>
            ),
        },
        {
            text: "Name",
            dataField: "name",
            sort: true
        },
        {
            text: "rate",
            dataField: "rate",
            sort: true,
        },
        {
            dataField: "currency_to_receive.iso_code",
            text: "currency_to_receive",
            sort: true,
        },
        {
            dataField: "currency_to_deliver.iso_code",
            text: "currency_to_deliver",
            sort: true,
        },
        // {
        //     dataField: "status",
        //     text: "Status",
        //     formatter: (cellContent, product) => (
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

    useEffect(() => {

        onGetProducts(window.location.search);
        setIsEdit(false)
    
    }, [window.location.search]);

    useEffect(() => {
        setProductList(products);
        setIsEdit(false)
    }, [products])

    useEffect(() => {
        if (!isEmpty(products) && !!isEdit) {
            setProductList(products)
            setIsEdit(false)
        }
    }, [products])

    const toggle = () => {
        setModal(!modal)
    }

    const handleProductClick = arg => {
        setShowError(false)
        const product = arg
        setProductToEdit({
            _id: product._id,
            name: product.name,
            currency_to_receive: product.currency_to_receive,
            currency_to_deliver: product.currency_to_deliver,
            rate: product.rate,
        })

        setIsEdit(true)
        setOpenFormModal(true)

        toggle()
    }

    const openDeleteDialog = (product) => {
        toggleDeleteModal()
        setScopedItem({
            _id: product._id,
            name: product.username
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
                _id: productList._id,
                name: values.name,
                currency_to_receive: values.currency_to_receive,
                currency_to_deliver: values.currency_to_deliver,
                rate: values.rate,
            }
            onUpdateProduct(updateProduct)
            setProductList(updateProduct)
        } else {
            const newProduct = {
                name: values["name"],
                currency_to_receive: values["currency_to_receive"],
                currency_to_deliver: values["currency_to_deliver"],
                rate: values["rate"],
            }
            onAddNewProduct(newProduct)
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
    }, [products, props.error])

    const handleProductClicks = () => {
        setOpenFormModal(true)
        setIsEdit(false)
        // setShowError(false)
        // setProductList('')
        // setIsEdit(false)
        // toggle()
    }

    const rolesList = async () => {
        try{
            let response = await getRoles()
            setRoles(response)
        } catch(er) {
            console.log(er)
        }
    }

    useEffect(() => {
        console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP')
        rolesList()
    }, [])

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
                                                            <Col sm="4">
                                                                <div className="search-box ms-2 mb-2 d-inline-block">
                                                                    <div className="position-relative">
                                                                        <SearchBar {...toolkitProps.searchProps} />
                                                                        <i className="bx bx-search-alt search-icon" />
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col sm="8">
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
                                                                        selectRow={selectRow}
                                                                        defaultSorted={defaultSorted}
                                                                        classes={
                                                                            "table align-middle table-nowrap table-hover"
                                                                        }
                                                                        remote
                                                                        onTableChange={
                                                                            (e)=>console.log('asdasd')
                                                                        }
                                                                        bordered={false}
                                                                        striped={false}
                                                                        responsive
                                                                    />

                                                                        
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