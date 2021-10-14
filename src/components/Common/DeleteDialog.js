import React, { useState, useEffect } from 'react'
import { Card, CardBody, Col, Container, Row, Modal, Button, ModalHeader, ModalBody, Alert } from "reactstrap"

const DeleteDialog = ({deleteModalIsOpen, setDeleteModalIsOpen, toggleDeleteModal, scopedItem, handleDelete, actionsLoading}) => {

    return (
        <Modal
            isOpen={deleteModalIsOpen}
            toggle={() => {
                toggleDeleteModal()
            }}
        >
            <div className="modal-header">
                <h5 className="modal-title mt-0" id="myModalLabel">
                    Delete 
                    <strong>{' '+scopedItem.name}</strong>
                            
                </h5>
                <button
                    type="button"
                    onClick={() => {
                        setDeleteModalIsOpen(false)
                    }}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <h5>Are you sure of this?</h5>
                <p>You wont be able to revert this action</p>
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    onClick={() => {
                        toggleDeleteModal()
                    }}
                    className="btn btn-secondary "
                    data-dismiss="modal"
                >
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-danger "
                    onClick={handleDelete}
                >
                    {
                        actionsLoading 
                            ? <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            : 'Delete' 
                    }
                
                </button>
            </div>
        </Modal>
    )
}

export default DeleteDialog;