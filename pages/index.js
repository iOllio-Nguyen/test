import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import { getSession, useSession } from 'next-auth/client'
import Modal from "react-modal"
import Link from 'next/link'
// import axios from 'axios'
// Styles
import styles from '../styles/home.module.css'
// Componet
import Menu from "../components/menu/menu"
import  SuccessLottie from "../components/utilities/SuccessLottie"


export async function getServerSideProps(ctx) {
  const baseURL  = ctx.req.headers.referer;
  // const items = await fetch(`${baseURL}api/DAO/getLaptopList`)
  // const data = await items.json()
  const data = []
  return {
    props: {
      data,
      baseURL: baseURL
      // userCredentical
    }
  }
}

Modal.setAppElement("#__next")

const App =(props)=> {
  console.log(props)
  const baseURL = props.baseURL
  const [laptopList, setLaptopList] = useState(props.data)
  const [isMessageModalOpen, setMessageModalSate] = useState(false)

  const fetchMoreData =async()=>{
      if(laptopList.length > 30){return}
      const items = await fetch(`${baseURL}api/DAO/getLaptopList`)
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