'use strict';

module.exports = function(ShoppingCart) {
    var STATUS_FOR_PAYMENT = 'FORPAYMENT';
    var STATUS_CANCELLED = 'CANCELLED';

    ShoppingCart.forPayment = function(id, cb) {
        var filter = {where: {referenceCode: id}};
        ShoppingCart.findOne(filter, function(err, shoppingCart){

            if(!shoppingCart){
                var error = 
                    new Error("Shopping cart: "+id+" doesn't exist");
                error.status = 404;
                return cb(error);
            }

            if(shoppingCart.status == STATUS_CANCELLED){
                var error = 
                    new Error("Cannot proceed shopping cart: "+id+" FOR PAYMENT since it is already CANCELLED");
                error.status = 422;
                return cb(error);
            }

            shoppingCart.updateAttribute(
                'status', 
                STATUS_FOR_PAYMENT, 
                function(err, instance){
                    var response = 
                        'Successfully updated status of shopping cart: '
                        +id+' as '+STATUS_FOR_PAYMENT;
                    cb(null, response);            
                }
            )
        });
    }
    ShoppingCart.cancellation = function(id, cb) {
        var filter = {where: {referenceCode: id}};
        ShoppingCart.findOne(filter, function(err, shoppingCart){
            
            if(shoppingCart.status == STATUS_FOR_PAYMENT){
                var error = 
                    new Error("Cannot CANCEL shopping cart: "+id+" since it is already FOR PAYMENT");
                error.status = 422;
                return cb(error);
            }
            shoppingCart.updateAttribute(
                'status', 
                STATUS_CANCELLED, 
                function(err, instance){
                    var response = 
                        'Successfully updated status of shopping cart: '
                        +id+' as '+STATUS_CANCELLED;
                    cb(null, response);            
                }
            )
        });
    };
    
    ShoppingCart.remoteMethod(
        'forPayment', 
        {
            accepts: {
                arg: 'id',
                type: 'string',
                required: true             
            },
            http: {
                path: '/:id/for-payment',
                verb: 'post'
            },
            returns: {
                arg: 'status',
                type: 'string'
            }
        }
    );

    ShoppingCart.remoteMethod(
        'cancellation', 
        {
            accepts: {
                arg: 'id',
                type: 'string',
                required: true             
            },
            http: {
                path: '/:id/for-payment',
                verb: 'delete'
            },
            returns: {
                arg: 'status',
                type: 'string'
            }
        }
    );
};
