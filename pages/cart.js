import React, { useState, useEffect } from "react";
import Modal from "react-modal"
import { motion } from 'framer-motion';
import modalStyle from '../styles/cartModal.module.css'
import style from "../styles/cart.module.css"
import Menu from "../components/menu/menu"
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import MessageModal from '../components/utilities/MessageModal'
import { data } from "remark";
// import Link from 'next/link'
// import loadingLottie from '../public/lottiefiles/loading.json'
// import Lottie from 'react-lottie'

export async function getServerSideProps(ctx) {
    const userCredentical = await getSession(ctx)
    return {
        props: {
        userCredentical
        }
    }
}

const Cart =(props)=> {
        const [cart,setCart] = useState(null)
        const [removeItem, setRemoveItem] = useState("")
        const userCredentical = props.userCredentical
        const [isQuantityChange, setQuantityChange] =  useState(false)

        const [messageModal, setMessageModal] = useState(false)
        const [loginState, setLoginState] = useState(false)
        const route =  useRouter()

        useEffect(() => {
            if(!cart){
                setCart(window.localStorage.getItem('webappCart')?JSON.parse(localStorage.getItem('webappCart')):[])
            }

            if(cart){
                if(cart.length > 0){    
                    const displayTotal = document.querySelector(`.${style.displayTotal}`)
                    let total = 0;
                    cart.forEach(item => 
                        total = total + ( Number(item.price)*Number(item.inCartQuantity) )
                    )
                    displayTotal.innerHTML = `$${total}`
                }
            }
        });

        const quantityChange =(itemName, newValue)=>{
            const itemIndex = cart.map((item) => {return item.name}).indexOf(itemName)
            cart[itemIndex].inCartQuantity = parseInt(newValue)
            localStorage.setItem('webappCart', JSON.stringify(cart))
            setCart(cart)
        }

        const applyCartChange =(newCart)=>{
            if(removeItem != ""){
                const itemIndex = cart.map((item) => {return item.name}).indexOf(removeItem.name) 
                cart.splice(itemIndex,1)
                newCart = cart
                setRemoveItem("")
            }else{
                setQuantityChange(!isQuantityChange)    
            }
            localStorage.setItem('webappCart', JSON.stringify(newCart))
        }
    
        const adjustQuantity =(action, itemName, quantityInput)=>{
            const itemIndex = cart.map((item) => {return item.name}).indexOf(itemName)
            const isIncrease = action === '+'
            let itemQuantity = cart[itemIndex].inCartQuantity

            if(isIncrease)
                itemQuantity +=1
            else
                itemQuantity == 1?setRemoveItem(cart[itemIndex]):itemQuantity -=1
            
            cart[itemIndex].inCartQuantity = itemQuantity
            quantityInput.value = itemQuantity
            applyCartChange(cart)
        }

        const openCheckOut =()=>{
            if(userCredentical){
                route.push('/checkOut')
            }else{
                setMessageModal(true)
            }
        }

        const renderCart =()=>{
            let items = []
            if(cart){  
                cart.forEach(item=>items.push(
                    <div className={style.item} key={item.name}>    
                        <motion.img 
                            whileHover={{
                            x: "-45%",
                            transition: {
                                delay: 0,
                                duration: 0.2
                            }
                        }}

                        className={style.itemPhoto} 
                        src={item.photo}/>                

                        <div className={style.itemInfo}>
                            <h4>{(item.name).toUpperCase()}</h4>
                            <li>{item.cpu}</li>
                            <li>{item.ram}</li>
                            <li>{item.gpu}</li>
                            <li>{item.storage}</li>
                            <li>{item.monitor}</li>
                            
                            <div className={style.itemConsole}>
                                <div className={style.quanityBox}>
                                    <a onClick={(event)=>adjustQuantity('-',item.name,event.target.parentNode.children[1])}>-</a>
                                    <input 
                                    type="number" 
                                    defaultValue={item.inCartQuantity} 
                                    onChange={event=>quantityChange(item.name, event.target.value)}
                                    />
                                    <a onClick={(event)=>adjustQuantity('+',item.name,event.target.parentNode.children[1])}>+</a>
                                </div>
                                <div className={style.removeBtn} onClick={()=>setRemoveItem(item)}>remove</div>
                            </div>
                        </div>
                    </div>
                ))
            }

            if(items.length == 0){      
                return(
                <div className={style.warn}>
                    <h4>Bạn chưa chọn sản phẩm nào</h4>
                    <img src="/cart/empty.png"/>
                </div>
                )
            }
            else{
                return( 
                <> 
                    <div className={style.title}>MY CART</div> 
                    <div className={style.container}>                   
                        {items}   
                    </div>
                    <div className={style.checkOut}>
                        <div className={style.showCartInfo}>
                            <a className={style.displayTotal}>$0</a> (*) Giá đã bao gồm VAT 10%
                        </div>
                        <div className={style.checkOutBtn} onClick={()=>openCheckOut()}>Check out</div>
                    </div>
                </> 
                )
            }
        }

        const renderNotice =()=>{
            const customModalStyles = {  
                overlay: {zIndex: 1000},
                content:{
                width: '400px',
                margin:'auto',
                height:'200px',
                padding:'0px',     
                boxShadow: '1px 1px 3px gray',
                borderRadius: '15px'
            }
        };

        return(
            <Modal style={customModalStyles} isOpen={removeItem!=""?true:false}>
                <div className={modalStyle.container}>
                    <li className={modalStyle.title}>Message</li>
                    <a><h4>Xóa bỏ sản phẩm "{removeItem.name}"?</h4></a>
                    <div>
                        <div onClick={()=>applyCartChange(null)}>Yes</div>
                        <div onClick={()=>setRemoveItem("")}>Cannel</div>
                    </div>
                </div>
            </Modal> 
        )
        }

        const openLogin =()=>{
            setMessageModal(false)
            setLoginState(true)
        }

        return(
            <>
                <Menu 
                loginState={loginState} 
                setLoginState={()=>setLoginState(false)}/>
                {renderCart()}
                {renderNotice()}
                {<MessageModal 
                modalState={messageModal} 
                closeMessage={()=>setMessageModal(false)}
                acceptMessage={()=>openLogin()}/>}
            </>        
        )
}

export default Cart