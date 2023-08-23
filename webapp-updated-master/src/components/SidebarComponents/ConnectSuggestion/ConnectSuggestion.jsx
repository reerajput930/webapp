import React, { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from "./ConnectSuggestion.module.css";
import NewSkeleton from "../../../components/Post Skeleton/News Skeleton/NewSkeleton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ConnectSuggestion({ isLoggedIn, openModal }) {
  const currentLoggedInUser = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);
  const navigate = useNavigate();

  //FETCH USER DATA FROM FIREBASE
  useEffect(() => {
    async function fetchUsers() {
      const usersRef = collection(db, "Users");
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      var isFinished = false;
      var localUsers = [];
      console.log("querySnapshot", querySnapshot);
      querySnapshot.docs.map((doc, idx) => {
        if (
          doc.data().hasOwnProperty("name") &&
          doc.data().name !== "" &&
          doc.data().hasOwnProperty("image") &&
          doc.data().image !== "" &&
          doc.data().hasOwnProperty("email") &&
          doc.data().email !== currentLoggedInUser?.user?.email &&
          (doc.data().hasOwnProperty("network") // Check if "network" array is present in doc.data()
            ? !doc.data().network.includes(currentLoggedInUser?.user?.email) // if present then only check current user's email is not included in it
            : true)
        ) {
          setUsers((prev) => {
            return [...prev, doc.data()];
          });
          localUsers.push(doc.data());
          if (idx === querySnapshot.docs.length - 1) {
            isFinished = true;
            if (localUsers.length > 0)
              getRandomUsers(4, setRandomUsers, localUsers);
          }
        }
      });
      if (isFinished) {
        localUsers = null; // This removes the reference to the localUsers array
      }
    }
    fetchUsers();
  }, [currentLoggedInUser]);

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }

  const getRandomUsers = (length, setUser, userArray) => {
    const modifiedArray = shuffleArray(userArray);
    setUser(modifiedArray.slice(0, length));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <text style={{ color: "#00B3FF" }}>Suggested </text>
          <text style={{ color: "#FFFFFF" }}>For You</text>
        </div>
        {/* <span onClick={() => console.log("see all clicked")}>See All</span> */}
      </div>
      {randomUsers.length === 0 ? <NewSkeleton cards={2} /> : null}

      <div>
        {randomUsers.map((user, index) => (
          <div key={index}>
            <div className={styles.userRow}>
              <div>
                <img
                  src={
                    user?.image
                      ? user.image
                      : require("../../../images/userIcon.webp")
                  }
                  className={styles.profileImage}
                  alt="Profile"
                />
                <div>
                  <text
                    style={{
                      fontSize: 14,
                      color: "#00b3ff",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.name}
                  </text>
                  <text
                    style={{
                      fontSize: 10,
                      color: "#ffffff",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.designation}
                  </text>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    return openModal();
                  } else {
                    //normal code

                    // user?.userType === "Mentor" ? navigate(`/mentorprofile/${user?.email}`)
                    // :
                    navigate(`/userprofile/${user?.email}`);
                  }
                }}
              >
                Connect
              </button>
            </div>
            <div className={styles.divider}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Set default props using defaultProps property
ConnectSuggestion.defaultProps = {
  isLoggedIn: true,
  openModal: () => {},
};

export default ConnectSuggestion;
// export default React.memo(React.forwardRef(ConnectSuggestion));