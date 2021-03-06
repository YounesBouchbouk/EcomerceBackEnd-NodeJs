const express = require('express')
const AuthCont = require('./../Controllers/AuthControllers')
const productsCnt = require('./../Controllers/ProductControllers')
const reviewRoutes = require('./ReviewRoute')
const routes = express.Router({mergeParams:true})


//switch  to reviews controllers 
routes.use('/:productID/reviews', reviewRoutes)
routes.route('/products/all').get(productsCnt.CategorieProducts)




routes.route('/Products')
            .get(productsCnt.getProducts)
            .post(AuthCont.private,AuthCont.restrictTo("admin"),productsCnt.AddProduct)
            
routes.route('/Product/:productID') 
            .get(productsCnt.sendProductInReqFromId,productsCnt.getOne)
            .delete(AuthCont.private ,AuthCont.restrictTo("admin"), productsCnt.DeletePro)
            .put(AuthCont.private,AuthCont.restrictTo("admin"),productsCnt.editeproduct)

routes.route('/Product/:productID/related')
            .get(productsCnt.sendProductInReqFromId,productsCnt.related)


module.exports = routes

