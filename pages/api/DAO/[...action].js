import mongodb from 'mongodb'
import { connect } from 'mongodb'
import mongoose from 'mongoose'
import { data } from 'remark'

const DAO = async(req,res)=>{
    const request = req.query.action
    
    const getConnection =()=>{
        return mongodb.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }

    if(request == 'getItemByName'){
        console.log("this is dao")
        let item = null;
        try{
            await getConnection().then(connection => connection.db('xshop').collection('laptop').findOne({name: req.body.name})
            .then(res => { 
                // console.log(res)
                item = res
                connection.close()
            }))
        } catch (error) {}
        return res.status(200).json(item)   
    }

    if(request == 'getUserByEmail'){
        let userCredentical = {}
        try{
            await getConnection().then(connection => connection.db('xshop').collection('userProfile').findOne({email: req.body.email})
            .then(credentical => { 
                userCredentical = credentical
                connection.close()
            }))
        } catch (error) {}
        return res.status(200).json(userCredentical)   
    }

    if(request == 'insert'){
        let isSuccess = null
        try {        
            const profile = {
                email: 'gjthanchien100@gmail.com',
                phoneNumber: '0981655117',
                address: 'Q12, TP.HCM',
                fullName:'Nguyen Minh Khoi',
                itemBrought: ''
            }

            isSuccess = await getConnection().then(connection => connection.db('xshop').collection('userProfile')
            .insertOne(profile, (err,res)=> {
                connection.close()
                return res.insertedCount?1:2
            
            }))
        
            responseStatus = 200 
        } catch (error) {}
        console.log(isSuccess)
    }

    if(request == 'finishCheckOut'){
        const paymentInfo = req.body
        
        await getConnection().then(connection => 
            connection.db('xshop').collection('purchasePending')
            .insertOne(paymentInfo, (err,res)=>{
                connection.close()
                // console.log(res)
            }))

        return res.status(200).json({ok:"pok"})
    }
        
    // const customerSchema = new mongoose.Schema({ name: String, age: Number, email: String });
    // var Customer = mongoose.model('Customer', customerSchema);

    if(request == 'getLaptopList'){
        const getConnection =()=>{
            return mongodb.connect(process.env.DATABASE_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
        }

        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
          })  

        let laptopList = []
        try {        
            // await getConnection()
            // .then(connection => connection.db('xshop').collection('laptop').find().toArray()
            // .then(data => {
            //     laptopList = data
            //     connection.close()
            // }))
            await mongoose.connection.collection('laptop').find().toArray().then(data => {
                laptopList = data
                mongoose.connection.close()
            })
        } catch (error) {}
        return res.status(200).json(laptopList)
    }
}

export default DAO