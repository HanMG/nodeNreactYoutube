import React, {useEffect, useState} from 'react'
import Axios from 'axios'

function Subscribe(props) {
    const userTo = props.userTo;
    const userFrom = props.userFrom;

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    const onSubscribe = () => {
        let subscribeVariables = {
            userTo: userTo,
            userFrom: userFrom     
        }
        // 이미 구독 중이라면 구독취소되게
        if(Subscribed){
            Axios.post('/api/subscribe/unSubscribe', subscribeVariables)
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
            Axios.post('/api/subscribe/subscribe', subscribeVariables)
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


    useEffect(() => {

        let subscribeNumberVariables = {
            userTo: userTo,
            userFrom: userFrom
        }
        //console.log(subscribeNumberVariables)

        // 구독자 수 
        Axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if(response.data.success){                  
                    setSubscribeNumber(response.data.subscribeNumber)
                }else{
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })
        
        // 구독여부
        Axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
            .then(response =>{
                if(response.data.success){
                    setSubscribed(response.data.subscribed)
                }else{
                    alert('구독 여부를 받아오지 못헀습니다.')
                }
            })
    }, [])


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
