import React,{useState,useEffect} from 'react'
import {Comment, Avatar, Button, Input} from 'antd'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import LikeDislike from './LikeDislike'

const { TextArea } = Input;

function SingleComment(props) {    

    const user = useSelector(state => state.user);
    
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onClickReplyOpen = () =>{
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) =>{
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) =>{
        event.preventDefault();

        // reponseTo 부모댓글
        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,           
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment',variables)
            .then(response =>{
                if(response.data.success){
                    console.log(response.data.result)
                    // 댓글 등록시 textarea 초기화
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                }else{
                    alert('코멘트를 저장하지 못했습니다.')
                }
            })


    }

    const actions = [
        <LikeDislike userId={localStorage.getItem('userId')} commentId={props.comment._id} writerId={props.comment.writer._id}/>,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt='image' />}
                content={<p>{props.comment.content}</p>}
            />
            {OpenReply &&
                <form style={{display: 'flex'}} onSubmit={onSubmit}>
                    <textarea 
                        style={{width: '100%', borderRadius: '5px', resize: 'none'}}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해주세요."                       
                    />                
                    <br/>
                    <button style={{width:'20%', height: '52px'}} onClick={onSubmit} >Submit</button>
                </form>    
            }
        </div>
    )
}

export default SingleComment
