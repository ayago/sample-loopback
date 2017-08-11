'use strict';

module.exports = function(Order) {

    //TODO add validation item and shopping cart id should already be existing

    Order.addToCart = function(itemId, shoppingCartId, quantity, cb){
        var filter = {where: {itemId: itemId, shoppingCartId: shoppingCartId}};
        Order.findOne(filter, function(err, order){
            if(err)
                return cb(err, "An error occured");

            if(!order){
                var newOrder = new Order();
                newOrder.itemId = itemId;
                newOrder.shoppingCartId = shoppingCartId;
                newOrder.quantity = quantity;
                Order.create(newOrder, function(err){
                    if(!err){
                        var response = 'Successfully added new order: '+itemId;
                        return cb(null, response);    
                    }else 
                        return cb(err, "An error occured");
                });
            }else{
                order.quantity += quantity;
                order.save(
                    function(err, instance){
                        if(!err){
                            var response = 
                                'Successfully updated quantity of order: '+itemId;
                            cb(null, response);  
                        }else
                            cb(err, "An error occured");
                                  
                    }
                );
            }
                
        })
    }

    Order.remoteMethod (
        'addToCart', 
        {
            http: {path: '/', verb: 'post'},
            accepts: [
                {
                    arg: 'itemId', 
                    type: 'number', 
                    http: { source: 'query' }, 
                    required: true,
                    description: 'Id of item to be ordered'  
                },
                {
                    arg: 'shoppingCartId', 
                    type: 'string', 
                    http: { source: 'query' }, 
                    required: true,
                    description: 'Current shopping cart id'  
                },
                {
                    arg: "quantity", 
                    http: { source: 'body' },
                    type:'number',
                    required: true,
                    description: 'Quantity for this order' 
                }
            ],    
            returns: {arg: 'message', type: 'string'},
            description: "Adds quantity if order is already existing, otherwise create new order."
        }
    );

    Order.disableRemoteMethodByName('create');
};
