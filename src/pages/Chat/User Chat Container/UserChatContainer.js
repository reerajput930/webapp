import React ,{useRef,useEffect}from 'react'
import { useSelector } from 'react-redux'
import styles from "./UserChatContainer.module.css"



const UserChatContainer = () => {
  const chatData=useSelector((state)=>state.chatLatest)
  const ref=useRef()
  const currentcUser = useSelector((state) => state.userDoc);
useEffect(()=>{
  ref.current.scrollTo({
    top:ref.current.scrollHeight,
    behavior:"smooth"
  })
},[chatData])


  return (
    <section ref={ref} className={styles.outerCont}>

{chatData.selectedUserData.map((chat,idx)=>{
  return <>
  <div key={idx} style={{alignSelf:chat.sendBy===currentcUser.email?"end":""}} className={styles.chatCont}>
    <img style={{display:"none",order:chat.sendBy===currentcUser.email?"2":""}} className={styles.userImg} src={chat.sendBy===currentcUser.email?currentcUser.image:chatData.selectedUser.userImg} alt="userImg" />
    <div  style={{background:chat.sendBy===currentcUser.email?"#4285F4":"#030B18"}} className={styles.messNTimeCont}>
      {chat.type?chat.type==="image/png"?<img className={styles.chatImg} src={chat.msg} alt="ima" />: <p>{chat.msg}</p>: <p>{chat.msg}</p>}
      {chat.imgMsg&&<img className={styles.chatImg} src={chat.imgMsg} alt="ima" />}
      <div style={{justifyContent:chat.sendBy===currentcUser.email?"end":"start"}} className={styles.wrapperTime}>
      <p style={{marginRight:chat.sendBy===currentcUser.email?"-1rem":"0",marginLeft:chat.sendBy===currentcUser.email?"0":"-15px"}}  className={styles.time}>{chat.createdAt!==""?new Date(chat.createdAt).toTimeString().slice(0,5):"N/A"}</p>
      </div>
    </div>
      </div>
  </>
})}

    </section>
  )
}

export default UserChatContainer