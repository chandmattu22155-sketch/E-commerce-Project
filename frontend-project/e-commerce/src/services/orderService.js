import { request } from './api'

export const fetchMyOrders = () => request('/order/my-orders/')


export const createOrder = (orderData) => 
  request('/order/create/', {
    method: 'POST',
    body: orderData,
  })