import React, { useState } from "react"
import Modal from "react-modal"
import modalStyle from '../../styles/cartModal.module.css'

Modal.setAppElement("#__next")

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



const MessageModal=(props)=>{
    return (
        <Modal style={customModalStyles} isOpen={props.modalState}>
            <div className={modalStyle.container}>
                <li className={modalStyle.title}>Message</li>
                <a><h4>Đăng nhập để tiếp tục</h4></a>
                <div>
                    <div onClick={()=>{props.acceptMessage()}}>Yes</div>
                    <div onClick={()=>{props.closeMessage()}}>Cannel</div>
                </div>
            </div>
        </Modal> 
    )
}

export default MessageModal