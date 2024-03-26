const jwt=require('jsonwebtoken');

const jwtAuthMiddleware=(req,res,next)=>
    {

        const authorization=req.headers.authorization
        if(!authorization){
            return res.status(500).json({message:"Token not found"})
        }
       const token=req.headers.authorization.split(' ')[1];
       if(!token){
        return res.status(401).json({message:"unauthorised"})
       }
       try{
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        req.user=decoded;
        next();
       }catch(error){
        console.log(error)
        res.status(401).json({error:"Invalid token"})
       }
    }

const generateToken=(studentData)=>
{
   return jwt.sign(studentData,process.env.SECRET_KEY,{expiresIn:'1h'});
}
    module.exports={jwtAuthMiddleware,generateToken}

