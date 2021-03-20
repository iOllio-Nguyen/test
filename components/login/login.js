import React from "react"
import Modal from "react-modal"
import style from '../../styles/modal.module.css'
import { useSession,signIn,signOut } from "next-auth/client"

const customModalStyles = {  
	overlay: {
	  zIndex: 1000
	},
	content:{
	  maxWidth: '500px',
	  padding:'10px',
	  margin:'auto',
	  height:'500px'
	}
};

const LoginForm =(props)=>{
	const user = props.data.user

	const formSubmit =async(e)=> {
		e.preventDefault()
		const emailRegexp = /^[\a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-][^@]{5,20}(\@[a-zA-Z0-9-]{2,10})(\.[a-zA-Z0-9-]{2,10}){1,2}$/m
		const email = e.target.querySelector('[name="email"]').value
		// const email="asdwdqwqqwdqwdqw@uuuuuuuuuuuuuuuu.csom"
		// await signIn('google', { email: e.target.querySelector('[name="email"]').value })
		
		// if(email.match(emailRegexp)){
		// 	console.log(email)
		// 	signIn('email', { email: e.target.querySelector('[name="email"]').value })			
		// }else{
		// 	this.setState({
		// 		isEmailValidate: false
		// 	})
		// }
	}

	
	return(
		<Modal style={customModalStyles} isOpen={true}>
			<div className={style.container}>
				<div className={style.close} onClick={()=>props.data.closeForm()}>Close</div>
				<form className={style.form}>	

				{!user ? (
					<>
					<a>Continue with email</a>
					{/* <input placeholder="email" name='email'/>
					<input type="submit" value="login"/> */}
					{/* <input type="button" value="Google login" onClick={()=>signIn('google', { callbackUrl: 'http://localhost:3000/?signIn=verified' })}/>	 */}
					<input type="button" value="Google login" onClick={()=>signIn('google')}/>		
					</>
				):(
					<>
					{user.email}
					{/* <input type="button" value="Sign out" onClick={()=>signOut({ callbackUrl: '/?signOut=success' })}/> */}
					<input type="button" value="Sign out" onClick={()=>signOut()}/>
					</>
				)}
				
				</form>
			</div>
		</Modal> 
	)

}

export default LoginForm