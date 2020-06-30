import React, {useEffect, useState} from 'react'
import {Tooltip, Icon} from 'antd'
import Axios from 'axios'


function LikeDislike(props) {

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [Dislikes, setDislikes] = useState(0)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variables = {}
    let writerId = props.writerId

    if(props.video){
        variables = {videoId: props.videoId, userId: props.userId}
       
    }else{
        variables = {commentId: props.commentId, userId: props.userId}
       
    }
    

    useEffect(() => {
        Axios.post('/api/like/getLikes',variables)
            .then(response => {
                if(response.data.success){

                    // 좋아요 카운트
                    setLikes(response.data.likes.length)

                    // 내가 좋아요를 클릭했는지 여부
                    response.data.likes.map(like =>{
                        if(like.userId === props.userId){
                            setLikeAction('liked')
                        }
                    })

                }else{
                    alert('Likes에 대한 정보를 가져오지 못했습니다.')
                }
            })
        Axios.post('/api/like/getDislikes',variables)
            .then(response => {
                if(response.data.success){

                    // 싫어요 카운트
                    setDislikes(response.data.dislikes.length)

                    // 내가 싫어요를 클릭했는지 여부
                    response.data.dislikes.map(like =>{
                        if(like.userId === props.userId){
                            setDislikeAction('disliked')
                        }
                    })
                    
                }else{
                    alert('Dislikes에 대한 정보를 가져오지 못했습니다.')
                }
            })    
    }, [])

    const onLike = () =>{
        if(writerId !== props.userId){
            // like 버튼이 눌리지 않은 상태
            if(LikeAction === null){
                Axios.post('/api/like/upLike', variables)
                    .then(response =>{
                        if(response.data.success){
                            setLikes(Likes + 1)
                            setLikeAction('liked')

                            if(DislikeAction !== null){
                                setDislikeAction(null)
                                setDislikes(Dislikes - 1)
                            }
                        }else{
                            alert('Like를 올리지 못하였습니다.')
                        }
                    })
            }else{ // like 버튼이 눌린 상태
                Axios.post('/api/like/unLike', variables)
                    .then(response =>{
                        if(response.data.success){                        
                            setLikes(Likes - 1)
                            setLikeAction(null)
                        }else{
                            alert('Like를 내리지 못하였습니다.')
                        }
                    })
            }
        }
    }

    const onDislike = () =>{
        if(writerId !== props.userId){
            // Dislike 버튼이 눌린 상태
            if(DislikeAction !== null){
                Axios.post('/api/like/unDislike', variables)
                    .then(response =>{
                        if(response.data.success){
                            setDislikes(Dislikes - 1)
                            setDislikeAction(null)
                        }else{
                            alert('Dislike를 지우지 못하였습니다.')
                        }
                    })
            }else{ // Dislike 버튼이 안눌린 상태
                Axios.post('/api/like/upDislike', variables)
                    .then(response =>{
                        if(response.data.success){
                            setDislikes(Dislikes + 1)
                            setDislikeAction('disliked')
                            if(LikeAction !== null){
                                setLikeAction(null)
                                setLikes(Likes - 1)
                            }
                        }else{
                            alert('Dislike를 지우지 못하였습니다.')
                        }
                    })
            }
        }
    }

    return (
        <div>
            <span key="comment-basic-like" style={props.videoId ? {fontSize:'18px',paddingRight:'18px'}:{paddingRight: '10px'}}>
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}>{Likes}</span>
            </span>
            <span key="comment-basic-dislike" style={props.videoId ? {fontSize:'18px',paddingRight:'18px'}:{paddingRight: '10px'}}>
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}>{Dislikes}</span>
            </span>
        </div>
    )
}

export default LikeDislike
