import { getTotalPrice, getOrdersByQuery } from './orders'; 
import {
  GetOrdersSearchQueryError,
  GetOrdersSearchItemsCountNegativeError,
  GetOrdersSearchTotalPriceArgIsNegativeError,
  GetOrdersSearchTotalPriceFormatError,
  GetOrdersSearchNoConditionError
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

describe('getOrdersByQuery', () => {
  it('should return orders for specific userIds', () => {
    const query = { userIds: ['A8A9861E-5E73-9F6C-9A47-D3F98C682B5D'] };
    const result = getOrdersByQuery(query);
    expect(result.length).toBe(1);
  });
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
  const orders = [
    { id: 1, userId: 'user1', items: [{ title: 'Item 1', pricePerUnit: 10, quantity: 2 }] },
    { id: 2, userId: 'user2', items: [{ title: 'Item 2', pricePerUnit: 20, quantity: 1 }] },
    { id: 3, userId: 'user1', items: [{ title: 'Item 3', pricePerUnit: 15, quantity: 3 }] },
  ];
  const query = { search: 'Order' }; 
  const result = getOrdersByQuery(query);
  expect(result.length).toBe(0); 
});

});