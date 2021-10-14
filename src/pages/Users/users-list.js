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
    getUsers,
    addNewUser,
    updateUser,
    deleteUser
} from "store/users/actions"
import _, { isEmpty, size, map } from "lodash"
import DeleteDialog from '../../components/Common/DeleteDialog'

const UsersList = props => {
    const { users, onGetUsers } = props
    const [userList, setUserList] = useState([])
    const [modal, setModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [roles, setRoles] = useState([]);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const [scopedItem, setScopedItem] = useState({})
    const [actionsLoading, setActionsLoading] = useState(false)

    const { SearchBar } = Search

    const onPageChange = (page, sizePerPage) => {
        props.history.push(window.location.pathname+'?page='+page)
    }

    const pageOptions = {
        sizePerPage: 20,
        totalSize: props.totalSize, // replace later with size(users),
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

    const contactListColumns = [
        {
            text: "id",
            dataField: "_id",
            sort: true,
            hidden: true,
            formatter: (cellContent, user) => (
                <>
                    {user.id}
                </>
            ),
        },
        {
            text: "Name",
            dataField: "name",
            sort: true,
            formatter: (cellContent, user) => (
                <>
                    <h5 className="font-size-14 mb-1">
                        <Link to="#" className="text-dark">
                            {user.name}
                        </Link>
                    </h5>
                    <p className="text-muted mb-0">{user.designation}</p>
                </>
            ),
        },
        {
            text: "Nickname",
            dataField: "nickname",
            sort: true,
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
        },
        {
            dataField: "roles",
            text: "Roles",
            sort: true,
            formatter: (cellContent, user) => ((cellContent && cellContent.length) > 0 ? cellContent[0].name : 'Loading...'),
        },
        // {
        //     dataField: "isEnabled",
        //     text: "Status",
        //     formatter: (cellContent, user) => (
        //         <div className="d-flex gap-3">
        //             <div class="btn-group" role="group" aria-label="Basic example">
        //                 <button 
        //                     onClick={()=>
        //                         props.onUpdateUser({
        //                             _id: user._id,
        //                             isEnabled: true
        //                         })} 
        //                     type="button"
        //                     className={`btn btn-sm btn-secondary ${cellContent ? 'active' : ''}`}
        //                 >
        //                     Enabled
        //                 </button>
        //                 <button 
        //                     onClick={()=>
        //                         props.onUpdateUser({
        //                             _id: user._id,
        //                             isEnabled: false
        //                         }
        //                     )} 
        //                     type="button" 
        //                     className={`btn btn-sm btn-secondary ${cellContent ? '' : 'active'}`}
        //                 >
        //                     Disabled
        //                 </button>
        //             </div>
        //         </div>
        //     ),
        // },
        {
            dataField: "menu",
            isDummyField: true,
            editable: false,
            text: "Action",
            formatter: (cellContent, user) => (
                <div className="d-flex gap-3">
                    <Link className="text-success" to="#"><i className="mdi mdi-pencil font-size-18" id="edittooltip" onClick={() => handleUserClick(user)}></i></Link>
                    <Link className="text-danger" to="#"><i className="mdi mdi-delete font-size-18" id="deletetooltip" onClick={() => openDeleteDialog(user)}></i></Link>
                </div>
            ),
        },
    ]

    useEffect(() => {
        if (users && !users.length) {
            onGetUsers(window.location.search);
            setIsEdit(false)
        }
    }, [onGetUsers, users.from, window.location.search]);

    useEffect(() => {

        onGetUsers(window.location.search);
        setIsEdit(false)
    
    }, [window.location.search]);

    useEffect(() => {
        setUserList(users);
        setIsEdit(false)
    }, [users])

    useEffect(() => {
        if (!isEmpty(users) && !!isEdit) {
            setUserList(users)
            setIsEdit(false)
        }
    }, [users])

    const toggle = () => {
        setModal(!modal)
    }

    const handleUserClick = arg => {
    
        const user = arg
        setUserList({
            _id: user._id,
            nickname: user.nickname,
            name: user.name,
            roles: user.roles,
            email: user.email,
        })

        setIsEdit(true)

        toggle()
    }

    const openDeleteDialog = (user) => {
        toggleDeleteModal()
        setScopedItem({
            _id: user._id,
            name: user.nickname
        })
    }

    const handleDeleteUser = () => {
        setActionsLoading(true)
        const { onDeleteUser } = props
        onDeleteUser(scopedItem)
    }


    const handleValidUserSubmit = (e, values) => {
        setActionsLoading(true)
        const { onAddNewUser, onUpdateUser } = props
        if (isEdit) {
            const updateUser = {
                _id: userList._id,
                name: values.name,
                email: values.email,
                roles: values.roles,
                nickname: values.nickname
            }
            onUpdateUser(updateUser)
            setUserList(updateUser)
        } else {
            const newUser = {
                name: values["name"],
                nickname: values["nickname"],
                email: values["email"],
                roles: values["roles"],
            }
            onAddNewUser(newUser)
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
    }, [users, props.error])

    const handleUserClicks = () => {
        setUserList('')
        setIsEdit(false)
        toggle()
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
                handleDelete={handleDeleteUser}
                actionsLoading={actionsLoading}
            />
            <div className="page-content">
                <MetaTags>
                    <title>User List | Skote - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Contacts" breadcrumbItem="User List" />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <PaginationProvider
                                      pagination={paginationFactory(pageOptions)}
                                      keyField='_id'
                                      columns={+contactListColumns}
                                      data={users}
                                    >
                                        {({ paginationProps, paginationTableProps }) => (
                                            <ToolkitProvider
                                              keyField="_id"
                                              data={users}
                                              columns={contactListColumns}
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
                                                                        onClick={handleUserClicks}
                                                                    >
                                                                        <i className="mdi mdi-plus-circle-outline me-1" />
                                                                        Create New User
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

                                                                        <Modal
                                                                            isOpen={modal} toggle={toggle}
                                                                        >
                                                                            <ModalHeader toggle={toggle} tag="h4">
                                                                                {!!isEdit ? "Edit User" : "Add User"}
                                                                            </ModalHeader>
                                                                            <ModalBody>
                                                                                <AvForm
                                                                                    onValidSubmit={
                                                                                        handleValidUserSubmit
                                                                                    }
                                                                                >
                                                                                <Row form>
                                                                                    <Col xs={12}>
                                                                                        {!_.isEmpty(props.error) ? (
                                                                                            <Alert color="danger">{props.error.response.data.message}</Alert>
                                                                                        ) : null}

                                                                                        <div className="mb-3">
                                                                                            <AvField
                                                                                                name="name"
                                                                                                label="Name"
                                                                                                type="text"
                                                                                                errorMessage="Invalid name"
                                                                                                validate={{
                                                                                                  required: { value: true },
                                                                                                }}
                                                                                                value={userList.name || ""}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="mb-3">
                                                                                            <AvField
                                                                                                name="email"
                                                                                                label="Email"
                                                                                                type="email"
                                                                                                errorMessage="Invalid Email"
                                                                                                validate={{
                                                                                                    required: { value: true },
                                                                                                }}
                                                                                                value={userList.email || ""}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="mb-3">
                                                                                            <AvField
                                                                                                name="nickname"
                                                                                                label="Nickname"
                                                                                                type="text"
                                                                                                errorMessage="Invalid nickname"
                                                                                                validate={{
                                                                                                    required: { value: true },
                                                                                                }}
                                                                                                value={userList.nickname || ""}
                                                                                            />
                                                                                        </div>
                                                                                        {
                                                                                            <div className="mb-3">
                                                                                                <AvField
                                                                                                    name="roles"
                                                                                                    label="Roles"
                                                                                                    type="select"
                                                                                                    errorMessage="Invalid Role"
                                                                                                    validate={{
                                                                                                        required: { value: true },
                                                                                                    }}
                                                                                                  // value={(isEdit && ) ? userList.roles[0]._id : ""}
                                                                                                >
                                                                                                    <option>Select a role</option>
                                                                                                    {
                                                                                                        roles.map( (x, i) => <option key={i} value={x._id}>{x.name.replace(' Role', '')}</option>)
                                                                                                    }
                                                                                                </AvField>
                                                                                            </div>
                                                                                        }
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <div className="text-end">
                                                                                            <button
                                                                                                type="submit"
                                                                                                className="btn btn-success save-user"
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

UsersList.propTypes = {
    users: PropTypes.array,
    onGetUsers: PropTypes.func,
    onAddNewUser: PropTypes.func,
    onDeleteUser: PropTypes.func,
    onUpdateUser: PropTypes.func
}

const mapStateToProps = ({ contacts }) => ({
    users: contacts.users,
    totalSize: contacts.totalSize,
    from: contacts.from,
    error: contacts.error
})

const mapDispatchToProps = dispatch => ({
    onGetUsers: (query) => dispatch(getUsers(query)),
    onAddNewUser: user => dispatch(addNewUser(user)),
    onUpdateUser: user => dispatch(updateUser(user)),
    onDeleteUser: user => dispatch(deleteUser(user)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(UsersList))
