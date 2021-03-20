import React, { useState, useEffect } from "react";
import { getSession, useSession } from 'next-auth/client'
import Modal from "react-modal"
import Link from 'next/link'

// Styles
import menuStyles from '../../styles/menu.module.css'

// Componet
import LoginForm from "../login/login"
// import MessageModal from "../components/utilities/MessageModal"
// import SigninVerifyModal from "../components/utilities/signinVerifyModal"
// import  SuccessLottie from "../components/utilities/SuccessLottie"

// export async function getServerSideProps(ctx) {
//   const items = await fetch('http://localhost:3000/api/DAO/getLaptopList')
//   const data = await items.json()
//   const userCredentical = await getSession(ctx)
   
//   return {
//     props: {
//       data,
//       userCredentical
//     }
//   }
// }

Modal.setAppElement("#__next")

const Menu =(props)=> {
    // let userCredentical = null
    const [userCredentical, setUser] = useSession()
    // const router = useRouter()
    // const signinError = router.query.error
    // const [isMessageModalOpen, setMessageModalSate] = useState(false)
 
    const [isSignin, openSignin] = useState(false)  
    const [isSearchFieldOpen, focusSearchField] = useState(false)
    let searchInputField = null

  useEffect(() => {
    if(isSearchFieldOpen){
      searchInputField.focus()
    }

    if(props.loginState) openSignin(true)
    const localStorage = window.localStorage;
    const cart = localStorage.getItem('webappCart')?JSON.parse(localStorage.getItem('webappCart')):[]
    let total = 0;
    if(cart.length > 0){
      cart.forEach(item => total += item.inCartQuantity)
      document.querySelector("#displayInCartQuantity").innerHTML=total
    }
  });

  const loginForm =()=>{
    if(isSignin){
      return( 
        <LoginForm data={{
          user: userCredentical, 
          closeForm: ()=>{
            openSignin(false)
            props.setLoginState()
          },
          // error: signinError?signinError:null
          error: null
        }}/>
      )
    } 
  }
  
  const renderMenu =()=>{
    return(
      <>
        <div className={menuStyles.bg}>
        <div className={menuStyles.bgOverlay}></div>  
        </div>
        <div className={menuStyles.mainmenu}>
          <div className={menuStyles.menu}>
              <div className={menuStyles.items}>
                <Link href="/" >
                <a>HOME</a>
                </Link>
                <a>BUILD</a>
                <a>ABOUT US</a>
              </div>
            
              <div className={menuStyles.loginitems}>
                  <div onClick={()=> focusSearchField(true)}
                    className={isSearchFieldOpen?menuStyles.openSearchField:menuStyles.closeSearchField}
                  >
                    <input type='text' placeholder='Text here...'
                      ref={input=>{searchInputField = input}}
                      onBlur={()=> focusSearchField(false)}
                    />
                    <div className={isSearchFieldOpen?menuStyles.searchIconActive:menuStyles.searchIcon}></div>
                  </div>
              
                  <div className={menuStyles.userNav} onClick={()=>openSignin(true)}>
                      <span className={menuStyles.userEmail}>{userCredentical?userCredentical.user.email:null}</span>
                      <img className={menuStyles.userPhoto} src='/menu/user.png' height='40'/>
                  </div>
                  <Link href="/cart">
                  <div className={menuStyles.cart}>
                    <a></a><img src="/menu/cart.png" height="30"/>
                    <div className={menuStyles.quanityDisplay} id="displayInCartQuantity"></div>
                  </div>
                  </Link>
                
              </div>
          </div>
        </div>
      </>
    )
  }

  // const renderMessageModal =()=>{
  //   if(isMessageModalOpen)
  //   return(<SuccessLottie closeSuccessLottie={setMessageModalSate}/>)
  // }

    return (
      <>
        {/* {renderMessageModal()} */}
        {renderMenu()}
        {loginForm()}
      </>
    )
  }

  export default Menu