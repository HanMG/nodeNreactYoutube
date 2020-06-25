import React, {useEffect, useState} from 'react'
import Axios from 'axios'

function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)
    useEffect(() => {

        let variable = {userTo: props.userTo}

        // 구독자 수 
        Axios.post('/api/subscribe/subscribeNumber',variable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(response.data.subscribeNumber)
                }else{
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })
        
        // 구독여부
        let subscribedVariable = {userTo: props.userTo, userFrom: localStorage.getItem('userId')}

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response =>{
                if(response.data.success){
                    setSubscribed(response.data.Subscribed)
                }else{
                    alert('구독 여부를 받아오지 못헀습니다.')
                }
            })
    }, [])

    const onSubscribe = () => {
        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom,        
        }
        // 이미 구독 중이라면 구독취소되게
        if(Subscribed){
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(response => {
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독취소하는데 실패 하였습니다.')
                    }
                })
            
        // 아직 구독 한게 아니라면 구독하게끔  
        }else{
            Axios.post('/api/subscribe/subscribe', subscribedVariable)
                .then(response => {
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독하는데 실패 하였습니다.')
                    }
                })
            

        }
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor:`${Subscribed ? '#AAAAAA':'#CC0000'}`,
                    borderRadius: '4px',
                    color: 'white',
                    padding: '10px 16px',
                    fontWeight: '500',
                    fontSize: '1rem',
                    textTransform: 'uppercase'            
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed': 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
