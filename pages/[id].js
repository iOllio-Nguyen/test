import style from '../styles/productInfo.module.css';
import React, { useState, useEffect } from "react";
import axios from 'axios'
// import { useRouter } from 'next/router'

import Menu from "../components/menu/menu"
import  SuccessLottie from "../components/utilities/SuccessLottie"
  
export async function getServerSideProps(ctx) {
    const id = ctx.query.id
    let item = ""

    await axios.post('http://localhost:3000/api/DAO/getItemByName',{name:id})
    .then(res => res.data?item=res.data:null)
    .catch(err => console.log(err))

    return {
        props: {
        item
        }
    }
}

const ProductInfo =(props)=> {
    const [isMessageModalOpen, setMessageModalSate] = useState(false)
    const laptop = props.item
    let cart = null; 

    useEffect(() => {
        if(!cart){
            const localStorage = window.localStorage;
            cart = localStorage.getItem('webappCart')?JSON.parse(localStorage.getItem('webappCart')):[]
        }
      });

    const renderItem =()=>{
        return(
            <div className={style.container}>
                <div className={style.photo}>      
                <img src={laptop.photo}/>
                </div>
        
                <div className={style.productInfo}>
                <h3>{(laptop.name + " - " + laptop.alias).toUpperCase()}</h3>
                <hr/>
                <li><a>CPU: </a> {laptop.cpu}</li>
                <li><a>RAM: </a> {laptop.ram}</li>         
                <li><a>GPU: </a> {laptop.gpu}</li>      
                <li><a>STORAGE: </a> {laptop.storage}</li>        
                <li><a>MONITOR: </a> {laptop.monitor}</li>        
                <hr/>
                
                <div className={style.priceDisplay}>
                    <a className={style.price}>${laptop.price}</a>
                    <div className={style.quanityBox}>
                    {/* <a onClick={(event)=>adjustQuantity(event.target.innerText, laptop.name)}>-</a>
                    <input type="number" defaultValue='1' onChange={event=>quantityChange(laptop.name, event.target.value)}/>
                    <a onClick={(event)=>adjustQuantity(event.target.innerText, laptop.name)}>+</a> */}
                    </div>
                    <a className={style.addBtn} onClick={()=>addToCart(laptop)}>Add to cart</a>
                </div>
                </div>          
            </div>
        )
    }

    const quantityChange =(itemName, newValue)=>{
      // const itemIndex = cart.map((item) => {return item.name}).indexOf(itemName)
      // cart[itemIndex].inCartQuantity = parseInt(newValue)
      // console.log(cart[itemIndex])
      // localStorage.setItem('webappCart', JSON.stringify(cart))
      // setCart(cart)
    }

    const applyCartChange =(newCart)=>{
        if(removeItem != ""){
            const itemIndex = cart.map((item) => {return item.name}).indexOf(removeItem.name) 
            cart.splice(itemIndex,1)
            newCart = cart
        }

        localStorage.setItem('webappCart', JSON.stringify(newCart))
        setRemoveItem("")
    }

    const adjustQuantity =(action, itemName, quantityInput)=>{
        const itemIndex = cart.map((item) => {return item.name}).indexOf(itemName)
        const isUp = action ==='+'
        let itemQuantity = cart[itemIndex].inCartQuantity
        
        if(isUp){
            itemQuantity +=1
        }else{
            itemQuantity -=1         
        }
        cart[itemIndex].inCartQuantity = itemQuantity
        quantityInput.value = itemQuantity

        if(itemQuantity == 0){
            setRemoveItem(cart[itemIndex])
        }else{
            cart[itemIndex].inCartQuantity = itemQuantity
        }

        applyCartChange(cart)
    }

    const addToCart = (item) =>{
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

    const renderMessageModal =()=>{
        if(isMessageModalOpen)
        return(<SuccessLottie closeSuccessLottie={setMessageModalSate}/>)
    }

    return (
        <>
            <Menu/>
            {laptop?renderItem():(<div>NOT FOUND</div>)}
            {renderMessageModal()}
        </>
    )
}

export default ProductInfo