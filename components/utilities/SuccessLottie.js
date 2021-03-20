import Modal from "react-modal"
import Lottie from 'react-lottie';
import verifiedLottie from '../../public/lottiefiles/verified.json'

const customModalStyles = {  
	overlay: {
	  zIndex: 1000
	},
	content:{
	  maxWidth: '400px',
	  padding:'10px',
	  margin:'auto',
	  height:'400px',
      border:'none',
      boxShadow:'1px 1px 3px gray',
	}
};


const SigninVerifyModal =(data)=>{
    const defaultOptions = {
        loop: false,
        autoplay: true, 
        animationData: verifiedLottie ,
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
                eventListeners={[
                    {
                        eventName: 'complete',
                        callback: ()=>data.closeSuccessLottie(false)
                    }
                ]}
            />
		</Modal> 
    )
}

export default SigninVerifyModal