import { getTotalPrice, getOrdersByQuery } from './orders'; 
import {
  GetOrdersSearchQueryError,
  GetOrdersSearchItemsCountNegativeError,
  GetOrdersSearchTotalPriceArgIsNegativeError,
  GetOrdersSearchTotalPriceFormatError,
  GetOrdersSearchNoConditionError,
  OrdersQuery,
} from './shared/orders.models';
import { expect, describe, it } from '@jest/globals';

describe('getTotalPrice function', () => {
  it('should return the correct total price for a given array of items', () => {
    const items = [
      { title: 'Item 1', pricePerUnit: 10, quantity: 2 },
      { title: 'Item 2', pricePerUnit: 15, quantity: 3 },
      { title: 'Item 3', pricePerUnit: 20, quantity: 1 },
    ];
    const totalPrice = getTotalPrice(items);
    expect(totalPrice).toBe(10 * 2 + 15 * 3 + 20 * 1);
  });
});

describe('getOrdersByQuery function', () => {
  const orders = [
    { id: 1, userId: 'user1', title: 'Order 1', items: [{ title: 'Item 1', quantity: 2, pricePerUnit: 10 }] },
    { id: 2, userId: 'user2', title: 'Order 2', items: [{ title: 'Item 2', quantity: 1, pricePerUnit: 20 }] },
    { id: 3, userId: 'user1', title: 'Order 3', items: [{ title: 'Item 3', quantity: 3, pricePerUnit: 15 }] },
  ];

  it('should throw GetOrdersSearchQueryError when search parameter is less than 3 characters', () => {
    const query = { search: 'ab' };
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchQueryError);
  });

  it('should throw GetOrdersSearchItemsCountNegativeError when itemsCount is negative', () => {
    const query = { itemsCount: -1 };
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchItemsCountNegativeError);
  });

  it('should throw GetOrdersSearchTotalPriceArgIsNegativeError when eq argument is negative', () => {
    const query = { totalPrice: { eq: -1, gt: 0, lt: 0 } }; 
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchTotalPriceArgIsNegativeError);
  });
  it('should throw GetOrdersSearchTotalPriceArgIsNegativeError when gt argument is negative', () => {
    const query = { totalPrice:  { eq: 0, gt: -1, lt: 0 } };
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchTotalPriceArgIsNegativeError);
  });

  it('should throw GetOrdersSearchTotalPriceArgIsNegativeError when lt argument is negative', () => {
    const query = { totalPrice:  { eq: 0, gt: 0, lt: -1 } };
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchTotalPriceArgIsNegativeError);
  });

  it('should throw GetOrdersSearchTotalPriceFormatError when both eq and gt/lt are provided', () => {
    const query = { totalPrice: { eq: 100, gt: 50, lt: 50} }; 
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchTotalPriceFormatError);
  });
  
  it('should throw GetOrdersSearchNoConditionError when no conditions are provided', () => {
    const query = {};
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchNoConditionError);
  });

  it('should return orders matching the search query', () => {
    const query = { search: 'Order' };
    const result = getOrdersByQuery(query);
    expect(result.length).toBe(3);
  });

  it('should return orders for specific userIds', () => {
    const query = { userIds: ['user1'] };
    const result = getOrdersByQuery(query);
    expect(result.length).toBe(2);
  });

  it('should return orders with a specific itemsCount', () => {
    const query = { itemsCount: 1 };
    const result = getOrdersByQuery(query);
    expect(result.length).toBe(1);
  });

  it('should return orders with total price equal to eq value', () => {
    const query: OrdersQuery = {
      totalPrice: { eq: 30, gt: 0, lt: Infinity } 
    };
    
    const result = getOrdersByQuery(query);
    expect(result.length).toBe(1);
    expect(getTotalPrice(result[0].items)).toBe(30);
  });

  it('should return orders with total price greater than gt value', () => {
    const query: OrdersQuery = {
      totalPrice: { gt: 30, lt: Infinity, eq: 0 } 
    };
    
    const result = getOrdersByQuery(query);
    expect(result.length).toBe(2);
  });
  
  it('should return orders with total price less than lt value', () => {
    const query: OrdersQuery = {
      totalPrice: { lt: 50, gt: -Infinity, eq: 0 }
    };
    
    const result = getOrdersByQuery(query);
    expect(result.length).toBe(2);
  });
  

  it('should return orders with total price between gt and lt values', () => {
    const query: OrdersQuery = {
      totalPrice: { gt: 20, lt: 40, eq: 0 } 
    };
    const result = getOrdersByQuery(query);
    expect(result.length).toBe(2);
  });
  
});