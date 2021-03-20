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
                // laptopList = data
                // laptopList = JSON.stringify(data)
                laptopList = [
                    {
                      _id: '6013eaeb30d2e9b39ded16fb',
                      name: 'Asus F570ZD',
                      cpu: 'i7-10750H',
                      ram: '8Gb 2666',
                      storage: 'SSD NVMe 512Gb M.2 PCIe Gen3x4',
                      gpu: 'GTX 1650Ti',
                      monitor: '17inch 1080P IPS 72% NTSC',
                      alias: 'gaming asus f570zd',
                      brand: 'Asus',
                      quanity: 20,
                      price: 599,
                      photo: 'https://res.cloudinary.com/dnnqp3qvg/image/upload/v1610379904/NextJS/a_12_yep4gc.jpg'
                    },
                    {
                      _id: '6017f11a7175c7d147b90010',
                      alias: 'gaming',
                      brand: 'Acer',
                      cpu: 'i5-10300H',
                      gpu: 'GTX 1660 6GB',
                      monitor: '15.6inch 1080P IPS 72% NTSC 144hz',
                      name: 'Acer Nitro5',
                      photo: 'https://res.cloudinary.com/dnnqp3qvg/image/upload/v1610379912/NextJS/a_9_mn1ouz.jpg',
                      price: 629,
                      quanity: 10,
                      ram: '8GB 2666',
                      storage: 'SSD NVMe 512GB M.2 PCIe Gen3x4'
                    },
                    {
                      _id: '6018142a7175c7d147b90011',
                      alias: 'laptop van phong',
                      brand: 'Asus',
                      cpu: 'i3-1005G1',
                      gpu: 'MX230 2GB',
                      monitor: '14inch 1080P IPS 45% NTSC',
                      name: 'Asus VivibookA504DX',
                      photo: 'https://res.cloudinary.com/dnnqp3qvg/image/upload/v1610379912/NextJS/a_9_mn1ouz.jpg',
                      price: 459,
                      quanity: 10,
                      ram: '4GB 2666',
                      storage: 'SSD NVMe 256GB M.2 PCIe Gen3x4'
                    },
                    {
                      _id: '6018147e7175c7d147b90012',
                      alias: 'vivobook asus D409DA',
                      brand: 'asus',
                      cpu: 'Ryzen5 4500U',
                      gpu: 'GTX 1650',
                      monitor: '15.6inch 1080P IPS 45% NTSC',
                      name: 'asus VivobookD409DA',
                      photo: 'https://res.cloudinary.com/dnnqp3qvg/image/upload/v1610379904/NextJS/a_12_yep4gc.jpg',
                      price: 359,
                      quanity: 15,
                      ram: '8Gb 2666',
                      storage: 'SSD NVMe 512Gb M.2 PCIe Gen3x4'
                    }
                  ]
                mongoose.connection.close()
            })
        } catch (error) {}
        return res.status(200).json(laptopList)
    }
}

export default DAO