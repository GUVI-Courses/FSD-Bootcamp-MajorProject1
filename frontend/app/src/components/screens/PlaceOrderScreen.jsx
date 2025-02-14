import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../CheckoutSteps";
import Message from "../Message";
import { createOrder } from "../../actions/orderActions";
import { ORDER_CREATE_RESET } from "../../constants/orderConstants";
import { useNavigate } from "react-router-dom";

function PlaceOrderScreen() {
  const navigate = useNavigate();
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;
  const [message, setMessage] = useState('')
  const dispatch = useDispatch();
  const handleClose = () => setMessage(false);
  const cart = useSelector((state) => state.cart);

  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);
  cart.shippingPrice = (cart.itemsPrice > 10000 ? 0 : 100).toFixed(2);
  cart.taxPrice = Number(0.1 * cart.itemsPrice).toFixed(2);

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);






  useEffect(() => {
    if (success) {
        navigate(`/order/${order._id}`)
        dispatch({ type: ORDER_CREATE_RESET })
    }
}, [success])




const placeOrder=()=>{
  dispatch(createOrder({
    orderItems:cart.cartItems,
    shippingAddress:cart.shippingAddress,
    paymentMethod:cart.paymentMethod,
    itemsPrice:cart.itemsPrice,
    shippingPrice:cart.shippingPrice,
    taxPrice:cart.taxPrice,
    totalPrice:cart.totalPrice
  }))
}





  return (
    <>
      <div>
        <CheckoutSteps step1 step2 step3 step4 />

        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>

                <p>
                  <strong>Shipping: </strong>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}
                  {"  "}
                  {cart.shippingAddress.postalCode},{"  "}
                  {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  Cash on Delivery
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {cart.cartItems.length === 0 ? (
                  <Message variant="info" onClose={handleClose}>Your cart is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>

                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>

                          <Col md={4}>
                            {item.qty} X {item.price} ={" "}
                            {(item.qty * item.price).toFixed(2)}
                          </Col>



                          
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>


          <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>Rs.{cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>Rs.{cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>Rs.{cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>Rs. {cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>


                            <ListGroup.Item>
                                {error && <Message variant='danger' onClose={handleClose}>{error}</Message>}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrder}
                             
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>




        </Row>
      </div>
    </>
  );
}

export default PlaceOrderScreen;
