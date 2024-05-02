що може бути по тестах тут :
should throw GetOrdersSearchQueryError when search parameter is less than 3 characters
should throw GetOrdersSearchItemsCountNegativeError when itemsCount is negative
should throw GetOrdersSearchTotalPriceArgIsNegativeError when eq/gt/lt argument is negative
should throw GetOrdersSearchTotalPriceFormatError when both eq and gt/lt are provided
should throw GetOrdersSearchNoConditionError when no conditions are provided
should return orders matching the search query
should return orders for specific userIds
should return orders with a specific itemsCount
should return orders with total price equal to eq value
should return orders with total price greater than gt value
should return orders with total price less than lt value
should return orders with total price between gt and lt values