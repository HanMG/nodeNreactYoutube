import React,{useEffect,useState} from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(() => {

        let commentNumber = 0;

        props.commentLists.map((comment)=>{
            if(comment.responseTo === props.parentCommentId){
                commentNumber++
            }
        })

        setChildCommentNumber(commentNumber)

    }, [props.commentLists, props.parentCommentId])


    // 중괄호를 안썻는데 중괄호를 사용시 출력할 부분을 return 해야한다.
    // 아니면 지금처럼 아예 없거나 ()를 사용하면됨.
    const renderReplyComment = (parentCommentId) => 
        props.commentLists.map((comment, index) => (
           
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId &&
                    <div style={{width: '80%', marginLeft: '20px'}}>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction}/>
                        <ReplyComment commentLists={props.commentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction}/>
                    </div>
                }   
            </React.Fragment>
    ))

    const onHandleChange = () =>{
        setOpenReplyComments(!OpenReplyComments)
    }
    

    return (
        <div>
            {ChildCommentNumber > 0 &&
                <p style={{fontSize:'14px', margin: 0, color:'gray'}} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }
        </div>
    )
}

export default ReplyComment
