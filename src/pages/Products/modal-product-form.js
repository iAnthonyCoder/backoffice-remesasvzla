import { Card, CardBody, Col, Container, Row, Modal, Button, ModalHeader, ModalBody, Alert } from "reactstrap"
import ProductForm from "./product-form"


const ModalProductForm = (props) => {


    


    return (
        

        <Modal
            isOpen={props.isOpen} 
            toggle={props.toggle}
            
        >
                <ModalHeader toggle={props.toggle} tag="h4">
                    {!!props.isEdit ? "Edit Product" : "Add Product"}
                </ModalHeader>
                <ModalBody>
                {(!_.isEmpty(props.error) && props.showError) ? (
                                                                                            <Alert color="danger">{props.error.response.data.message}</Alert>
                                                                                        ) : null}
                    <ProductForm 
                        handleValidProductSubmit={props.handleValidProductSubmit}
                        isEdit={props.isEdit}
                        productToEdit={props.productToEdit}
                        actionsLoading={props.actionsLoading}
                        setActionsLoading={props.setActionsLoading}
                     
                    />

                    {/* <AvForm
                        onValidSubmit={
                            handleValidProductSubmit
                        }
                        autoComplete="off"
                    >
                    <Row form>
                        <Col xs={12}>
                            {(!_.isEmpty(props.error) && showError) ? (
                                <Alert color="danger">{props.error.response.data.message}</Alert>
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
                                    value={productList.name || ""}
                                />
                            </div>
        
                            <div className="mb-3">
                                <AvField
                                    name="rate"
                                    label="Rate"
                                    type="number"
                                    errorMessage="Invalid secret"
                                    validate={{
                                        required: { value: true },
                                    }}
                                    value={productList.rate || ""}
                                />
                            </div>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="text-end">
                                <button
                                    type="submit"
                                    className="btn btn-success save-product"
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
                </AvForm> */}
            </ModalBody>
        </Modal>
    )
}

export default ModalProductForm