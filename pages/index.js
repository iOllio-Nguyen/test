import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getSession, useSession } from 'next-auth/client'
import Modal from "react-modal"
import Link from 'next/link'
// Styles
import styles from '../styles/home.module.css'
// Componet
import Menu from "../components/menu/menu"
import  SuccessLottie from "../components/utilities/SuccessLottie"


export async function getServerSideProps(ctx) {
  let data = ""
  try{
    // const items = await fetch('/api/DAO/getLaptopList')
    // data = await items.json()
    data=  [
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
  }
  catch(err){
    data=err
  }
  // const userCredentical = await getSession(ctx)
  return {
    props: {
      data: JSON.stringify(data),
      // userCredentical
    }
  }
}

Modal.setAppElement("#__next")

const App =(props)=> {
  console.log(props)
  const [laptopList, setLaptopList] = useState(JSON.parse(props.data))
  const [isMessageModalOpen, setMessageModalSate] = useState(false)

  const fetchMoreData =async()=>{
      if(laptopList.length > 30){return}
      
      const items = await fetch('/api/DAO/getLaptopList')
      const data = await items.json()
      setLaptopList(laptopList.concat(data))
  }

  const addToCart = (item) =>{
    const localStorage = window.localStorage;
    const cart = localStorage.getItem('webappCart')?JSON.parse(localStorage.getItem('webappCart')):[]
    const itemIndex = cart.map((item) => {return item.name}).indexOf(item.name)
   
    if(itemIndex == -1){
      item.inCartQuantity = 1
      cart.push(item) 
    }
    else{
      cart[itemIndex].inCartQuantity += 1
    }
    localStorage.setItem('webappCart', JSON.stringify(cart))
    setMessageModalSate(true)
  }
  
  const renderBody =()=>{
      return(    
        <InfiniteScroll
          dataLength={laptopList.length}
          next={fetchMoreData}
          hasMore={true}
          loader={<h4>Fetching...</h4>}
          className={styles.productsContainer}
        >        
          {laptopList.map((laptop, index) => (
            <div className={styles.product} key={index}> 
              <Link href={`/${laptop.name}`}>
              <div>
                <img src={laptop.photo} />
                
                <div className={styles.textBody}>
                  <h4>{laptop.name}</h4>
                  <div>{laptop.cpu} - {laptop.ram} - {laptop.gpu} - {laptop.storage} - {laptop.monitor}</div>
                </div>
              </div>
              </Link>
            
              <div className={styles.productFooter}>
                <div className={styles.priceTag}>${laptop.price}</div>
                <div className={styles.buyBtn} onClick={() => addToCart(laptop)}> Add to cart </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      )
  }

  const renderMessageModal =()=>{
    if(isMessageModalOpen)
    return(<SuccessLottie closeSuccessLottie={setMessageModalSate}/>)
  }

    return (
      <>
        <Menu/>
        {renderBody()}
        {renderMessageModal()}
      </>
    );
  }

  export default App