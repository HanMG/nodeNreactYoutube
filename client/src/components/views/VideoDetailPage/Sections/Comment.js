import React,{useState, useEffect} from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {    
    const postId = props.postId;
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")

    const handleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }   

    const onSubmit = (event) =>{
        event.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: postId
        }

        Axios.post('/api/comment/saveComment',variables)
            .then(response =>{
                if(response.data.success){
                    //console.log(response.data.result)
                    // 댓글 등록시 textarea 초기화
                    setCommentValue("")
                    props.refreshFunction(response.data.result)
                }else{
                    alert('코멘트를 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br/>
            <p>Replies</p>
            <hr/>

            {/* Comment List */}
            {props.commentLists && props.commentLists.map((comment, index)=>(
                (!comment.responseTo &&
                    // div 혹은 react.fragment를 안하면 에러가뜸.
                    <React.Fragment key={comment._id}>
                        <SingleComment comment={comment} postId={postId} refreshFunction={props.refreshFunction}/>
                        <ReplyComment commentLists={props.commentLists} postId={postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}
            {/* Root Comment Form */}

            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <textarea 
                    style={{width: '100%', borderRadius: '5px', resize: 'none'}}
                    onChange={handleChange}
                    value={CommentValue}
                    placeholder="코멘트를 작성해주세요."
                />                
                <br/>
                <button style={{width:'20%', height: '52px'}} onClick={onSubmit}>Submit</button>
            </form>


        </div>
    )
}

export default Comment
