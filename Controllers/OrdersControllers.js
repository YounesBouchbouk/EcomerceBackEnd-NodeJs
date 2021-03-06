const Order = require('./../Models/OrderModel')
const CatchAsync = require('./../utils/asyncError')
const AppError = require('./../utils/appError')
const ApiFeature = require('./../utils/apiGlobalFeature')
const Product = require('../Models/ProductModel')

exports.addOrder = CatchAsync(async (req,res,next)  => {
    const User_Cust = {User_Cust : req.user._id}
    const OrderDt = req.body
    Object.assign(OrderDt,User_Cust)
    // console.log(OrderDt);
    const NewOrder = await Order.create(OrderDt)
    res.status(200).json({
        status : req.bulkOps
    })
})

exports.getOrders = CatchAsync(async (req,res,next)  => {
    
    const OrderFeature = new ApiFeature(Order.find(),req.query)
                                                                .Search()
                                                                .filter()
                                                                .sort()
                                                                .limitefields()
                                                                .paningtation()
    
    const Orders = await OrderFeature.query.populate({
        path : 'OrderItems',
        populate : {
            path : 'Product'
        }
    })
    // console.log(Orders);
    if(!Orders) next(new AppError('No Order With this id',401) )

    res.status(200).json({
        status : Orders
    })
})

exports.orderById = CatchAsync(async (req,res,next) => {
    const SelectedOrder = await Order.findById(req.params.OrderId)
    if(!SelectedOrder || SelectedOrder.length == 0) next(new AppError('aucun Order With this id ',401))
    req.myOrder = SelectedOrder
    console.log(SelectedOrder);
    next()
} )

exports.ChangeStatus = CatchAsync(async (req,res,next) =>{
    if(req.params.Status == "Shipped" || req.params.Status == "Delivered"  || req.params.Status == "Cancelled"){
        const NewStatus = {Status : req.params.Status}

        const Orderall = await Order.findById(req.params.OrderId)

        Object.assign(Orderall,NewStatus)
        console.log(Orderall);

        const newOrder = await Orderall.save()

        res.status(200).json(Orderall)



    }else{
        next(new AppError('chose valide status' , 400))
    }
})

// exports.changeOrderStatus = (req,res,next,newstatus) => {
//     return CatchAsync(async(req,res,next) => {
//         const order = Order.find(req.params)
//         console.log(newstatus);
//         res.status(200).json({
//             order
//         })

//     })
// }


