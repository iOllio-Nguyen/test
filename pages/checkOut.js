import style from '../styles/payment.module.css'
import React, { useState, useEffect } from "react"
import Modal from "react-modal"
import { getSession, useSession } from 'next-auth/client'
import axios from 'axios'
import loadingLottie from '../public/lottiefiles/loading.json'
import Lottie from 'react-lottie'
import Menu from "../components/menu/menu"

export async function getServerSideProps(ctx) {
    const userCredentical = await getSession(ctx) 
    return {
        props: {
            userCredentical
        }
    }
}

Modal.setAppElement("#__next")

const Payment =(props)=> {
    const [cart, setCart] = useState(null)
    const userCredentical = props.userCredentical
    const [userProfile, setUserProfile] = useState(null)
   
    const getUserInfo =()=>{
        axios.post('http://localhost:3000/api/DAO/getUserByEmail', {
            email: userCredentical.user.email
        }).then((profile)=>{
            setUserProfile(profile.data)
            console.log(profile.data)
        })
    }

    useEffect(() => {
        if(!cart){
            setCart(window.localStorage.getItem('webappCart')?JSON.parse(localStorage.getItem('webappCart')):[])
        }
    });

    const renderPreviewList=()=>{
        let items = []
        if(cart){
            cart.forEach(item=>items.push(
                <div className={style.item} key={item.name}>
                <img src={item.photo}/>
                <div className={style.itemInfo}>
                    <div name="itemName">{item.name}</div>
                    
                    <div name="preInfo">
                        <a>Quantity: {item.inCartQuantity}  ${item.price}</a>
                        <a>${item.inCartQuantity*item.price}</a>
                    </div>

                    <div name="warrantyInfo">3 years warranty</div>
                </div>
                </div>
            ))
        }
        return ( 
            <div className={style.itemPreview}>
                <div className={style.previewList}>
                    {items}
                </div>
            </div>
        )
    }

    const renderLoading=()=>{
        getUserInfo()
        const customModalStyles = {  
            overlay: {
              zIndex: 1000
            },
            
            content:{
              maxWidth: '500px',
              padding:'10px',
              margin:'auto',
              height:'500px',
              border:'none',
              boxShadow:'1px 1px 3px gray'
            }
        };

        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: loadingLottie ,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return(
            <Modal style={customModalStyles} isOpen={true}>
                <Lottie options={defaultOptions}
                    height='100%'
                    width='100%'
                    isStopped={false}
                    isPaused={false}
                />
            </Modal> 
        )
    }   

    const finishPayment=()=>{
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')

        if(userProfile.fullName == "" || userProfile.address == "" 
            || userProfile.phoneNumber == "" || paymentMethod == null ){
            return    
        }else{
            const paymentInfo ={ 
                method:paymentMethod.value,
                userProfile:userProfile,
                cart:cart
            }
            axios.post('http://localhost:3000/api/DAO/finishCheckOut', paymentInfo)
            .then(res=> {
                window.location.href = '/'
                window.localStorage.removeItem('webappCart')
            })
        }
    }

    const updateUserProfile=(attributeName, newInput)=>{
        if(attributeName=="fullname"){
            userProfile.fullName = newInput
        }
        if(attributeName=="phonenumber"){
            userProfile.phoneNumber = newInput
        }
        if(attributeName=="address"){
            userProfile.address = newInput
        }
    }

    const renderPaymentInfo=()=>{
        const profile = userProfile
        return(
            <div>
                <div className={style.paymentInfoForm}>
                    <div className={style.userInfo}>
                        <input name="fullname" placeholder='Full name' 
                            defaultValue={profile.fullName?profile.fullName:""} onChange={event=>updateUserProfile("fullname",event.target.value)}/>
                        <input name="phonenumber" placeholder='Phone number' 
                            defaultValue={profile.phoneNumber?userProfile.phoneNumber:""} onChange={event=>updateUserProfile("phonenumber",event.target.value)}/>
                        <input name="address" placeholder='Address' 
                            defaultValue={profile.address?profile.address:""} onChange={event=>updateUserProfile("address",event.target.value)}/>
                        <input name="note" placeholder='Note' onChange={event=>updateUserProfile("note",event.target.value)}/>
                    </div>

                    <div className ={style.paymentMethod}>
                        <div>
                            <div>
                                <input type="radio" id="method1" name="paymentMethod" value="1"/>
                                <label htmlFor="method1">Trả sau khi nhận hàng</label>
                            </div>
                            <div>
                                <input type="radio" id="method2" name="paymentMethod" value="2"/>
                                <label htmlFor="method2">Trả qua chuyển khoản</label>
                            </div>
                            <div>
                                <input type="radio" id="method3" name="paymentMethod" value="2"/>
                                <label htmlFor="method3">Nhận tại quầy</label>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>  
        )
    }

    const couponChecking=(coupon)=>{
        console.log(coupon)
        if(coupon == 'giamgia10'){
            let displayTotal = document.querySelector(`.${style.totalPrice}`)
            let discount = Number(displayTotal.innerHTML.substring(1))*0.9
            displayTotal.innerHTML = `$${discount}`
            setCoupon(!coupon)
        }
    }

    const renderCheckOutInfo=()=>{
        let total = 0
        cart.forEach(item => total += item.price * item.inCartQuantity)
        
        return(
            <div className={style.checkOutInfo}> 
                <div className={style.checkOutInfoContent}> 
                    <div className={style.couponInput}><a>Coupon :</a><input 
                    defaultValue='' onChange={(e)=>couponChecking(e.target.value)} placeholder='Enter coupon here'/></div>
                    
                    <div className={style.stickyPannel}> 
                        <div className={style.totalPrice}>{`$${total}`}</div>
                        <div className={style.finishCheckOutBtn} onClick={()=>finishPayment()}>Finish</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Menu/>
            {userCredentical?(
                userProfile?( 
                    <div className={style.container}> 
                        <div className={style.content}>
                            {renderPreviewList()}
                            {renderPaymentInfo()}
                            {renderCheckOutInfo()}
                        </div>
                    </div>
                ):(<>{renderLoading()}</>)
            ):(<div>need to login</div>)}
        </>
    )
}

export default Payment