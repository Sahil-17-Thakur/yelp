const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const joiSchema = Joi.object({

    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    
    deleteImages: Joi.array()
});


const validateJoiSchema = (req,res,next)=>{
  
  const {error} = joiSchema.validate(req.body);
  if(error){
     const msg = error.details.map(e => e.message).join(',')
     throw new ExpressError(msg,404)
   } 
   else{
      next();
    }
  }
    // review joi schema
   
    

    const reviewJoiSchema = Joi.object({
      rating: Joi.number().required().min(1).max(5),
      review: Joi.string().required()
    })
    module.exports = {joiSchema,reviewJoiSchema};
   
    //validate function for review schema
    const validateJoiReviewSchema = (req,res,next)=>{
  
      const {error} = reviewJoiSchema.validate(req.body);
      if(error){
         const msg = error.details.map(e => e.message).join(',')
         throw new ExpressError(msg,404)
       } 
       else{
          next();
        }
      }

      
      
      
      
       module.exports = {validateJoiSchema,validateJoiReviewSchema};