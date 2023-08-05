import styles from "./vibeMiddlePart.module.css";
import filterIcon from "../../../images/filterIcon.svg";
// import userProfilePucture from "../../../images/userProfilePicture.svg";
import location from "../../../images/location.svg";
import videoCall from "../../../images/videocallimg.svg";
import phoneCall from "../../../images/phonecallimg.svg";
import atCoffee from "../../../images/atcoffeeimg.svg";
import phoneIcon from "../../../images/phoneMiniIcon.svg";
import emailIcon from "../../../images/emailMiniIcon.svg";
import linkedinIcon from "../../../images/linkedinMiniIcon.svg";
import twitterIcon from "../../../images/twitterMiniIcon.svg";
import nopeIcon from "../../../images/nopeIcon.svg";
import handShakeIcon from "../../../images/handshakeIcon.svg";
import blueLikeIcon from "../../../images/bluelikeIcon.svg";
import undoMoveIcon from "../../../images/undoMoveIcon.svg";
import FilterRedoPopUp from "../vibemiddleparta/FilterRedoPopUp";
import FilterPart from "../FilterPart/FilterPart";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import defaultImg from "../../../images/default-profile-pic.webp";
import { toast } from "react-toastify";
import NoData from "./No Data Screen/NoData";

const VibeMiddlePart = () => {
  const [ispremium, setIsPremium] = useState(false);
  const [redo, SetRedo] = useState(false);
  const [frtext, setFRText] = useState("");
  const [filter, setFilter] = useState(false);
  const [userData, setUserData] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [noMoreVibeData, setNoMoreVibeData] = useState(false);
  const [swipeLimit, setSwipeLimit] = useState({
    swipeRemaining: 10,
    swipeUpdateTime: null,
  });
  const [loadingSwipeData, setLoadingSwipeData] = useState(true);
  const currentLoggedInUser = useSelector((state) => state.user);
  const userDoc = useSelector((state) => state.userDoc);
  const howToMeetImages = {
    "Video Call": videoCall,
    "Phone Call": phoneCall,
    "At Coffee": atCoffee,
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        console.log("userDoc data fetch");
        const userRef = await collection(db, "Users");
        const userquery = await query(userRef);
        const usersnapshot = await getDocs(userquery);

        const currentUserLikes = userDoc?.liked || [];
        console.log("currentUserLikes", currentUserLikes);

        const fleshedByCurrentUser = userDoc?.passed_email || [];
        console.log("fleshedByCurrentUser", fleshedByCurrentUser);
        const filteredDocs = usersnapshot.docs.filter(
          (doc) =>
            doc.data().email !== userDoc?.email &&
            !currentUserLikes.includes(doc.data().email) &&
            !fleshedByCurrentUser.includes(doc.data().email) &&
            doc.data().vibeuser === "true"
        );
        console.log("filteredDocs", filteredDocs);
        const fetchedUserData = filteredDocs.map((doc) => doc.data());
        setUserData(fetchedUserData);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUserData();
  }, []);

  console.log("userdatV", userData);

  const handleLikeCkick = () => {
    // if the user has no swipe remaining and the update time is not reached yet
    // then show the toast message and return

    if (
      swipeLimit.swipeRemaining === 0 &&
      swipeLimit.swipeUpdateTime > new Date().getTime()
    ) {
      toast(
        `You have reached the limit. Please wait till ${new Date(
          swipeLimit.swipeUpdateTime
        ).toLocaleString()}`
      );
      return;
    }

    LikeUser(userData[currentUserIndex].email);

    if (currentUserIndex < userData.length - 1) {
      console.log(userData[currentUserIndex]);
      setCurrentUserIndex(currentUserIndex + 1);
    }

    // handleSwipe();
  };

  const handleNopeCkick = () => {
    if (currentUserIndex < userData.length - 1) {
      console.log(userData);
      setCurrentUserIndex(currentUserIndex + 1);
    }
    NopeUser();
  };

  // console.log(userDoc?.vibeuser);
  const CheckisPremium = () => {
    if (!ispremium) {
      return SetRedo(true);
    }
    // if (!userDoc?.vibeuser) {
    //   return SetRedo(true);
    // }
  };
  const CheckisPremiumFilter=()=>{
    if(!ispremium){
      return setFilter(true)
    }
  }

  //---------------------Swipe Limit Code Start---------------------//
  useEffect(() => {
    // Fetch the initial swipeLimit data from Firebase or create it if not present
    const fetchSwipeLimit = async () => {
      const userEmail = currentLoggedInUser?.user?.email;
      if (!userEmail) {
        throw new Error("User email not available");
      }
      try {
        setLoadingSwipeData(true);
        const docRef = doc(db, "Users", userEmail);
        console.log("docRef", docRef);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log("data", data);
          if (data.swipeLimit) {
            setSwipeLimit(data.swipeLimit);
          } else {
            // If swipeLimit field is not present, create it with initial values
            const updateTime = new Date().getTime() + 24 * 60 * 60 * 1000;
            // await setDoc(docRef, data, { merge: true });
            await setDoc(
              docRef,
              {
                swipeLimit: { swipeRemaining: 10, swipeUpdateTime: updateTime },
              },
              { merge: true }
            );
            setSwipeLimit({ swipeRemaining: 10, swipeUpdateTime: updateTime });
          }
        } else {
          console.log("No such document!");
        }

        setLoadingSwipeData(false);
      } catch (error) {
        console.error("Error fetching swipeLimit data:", error);
        setLoadingSwipeData(false);
      }
    };

    // fetchSwipeLimit();
  }, [currentLoggedInUser]);

  const handleSwipe = async () => {
    // i have still some swipe remaining and the update time is not reached yet
    if (
      swipeLimit.swipeRemaining > 0 &&
      swipeLimit.swipeUpdateTime > new Date().getTime()
    ) {
      // User has remaining swipes, decrease swipeRemaining by 1
      const newSwipeRemaining = swipeLimit.swipeRemaining - 1;
      setSwipeLimit((prevState) => ({
        ...prevState,
        swipeRemaining: newSwipeRemaining,
      }));
      await updateSwipeLimit({
        swipeRemaining: newSwipeRemaining,
        swipeUpdateTime: swipeLimit.swipeUpdateTime,
      });
    } else {
      // If swipeUpdateTime is already passed, reset swipeRemaining to 10 and update swipeUpdateTime
      if (swipeLimit.swipeUpdateTime <= new Date().getTime()) {
        console.log("it't time to reset");
        setSwipeLimit((prevState) => ({
          ...prevState,
          swipeRemaining: 10,
          swipeUpdateTime: new Date().getTime() + 24 * 60 * 60 * 1000,
        }));
        await updateSwipeLimit({
          swipeRemaining: 10,
          swipeUpdateTime: new Date().getTime() + 24 * 60 * 60 * 1000,
        });
      } else {
        console.log("wait for swipeUpdateTime");
      }
    }
  };

  const updateSwipeLimit = async (newSwipeLimit) => {
    const userEmail = currentLoggedInUser?.user?.email;
    if (!userEmail) {
      throw new Error("User email not available");
    }
    try {
      await updateDoc(doc(db, "Users", userEmail), {
        swipeLimit: newSwipeLimit,
      });
    } catch (error) {
      console.error("Error updating swipeLimit on Firebase:", error);
    }
  };
  //---------------------Swipe Limit Code End---------------------//

  // ------------------HandShake---------------------------------
  const HandShakeUser = async (userEmail) => {
    const docRef = doc(db, "Users", userDoc?.email);
    const otherDocRef = doc(db, "Users", userEmail);
    try {
      const docSnap = await getDoc(docRef);
      const otherDocSnap = await getDoc(otherDocRef);

      if (docSnap.exists()) {
        let superlikes;

        if (!docSnap.data().handShake) {
          superlikes = [];
        } else {
          superlikes = docSnap.data().superlikes;
        }

        if (superlikes.includes(userEmail)) {
          console.log("Already HandShaked");
        } else {
          await updateDoc(docRef, {
            handShake: [...superlikes, userEmail],
          });
        }
      }

      if (otherDocSnap.exists()) {
        let superliked_by;

        if (!otherDocSnap.data().superliked_by) {
          superliked_by = [];
        } else {
          superliked_by = otherDocSnap.data().superliked_by;
        }

        if (superliked_by.includes(userDoc?.email)) {
          console.log("Already HandShaked");
        } else {
          await updateDoc(otherDocRef, {
            handShake: [...superliked_by, userDoc?.email],
          });
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const NopeUser = async (userEmail) => {
    FlushUser(userEmail);
  };

  const LikeUser = async (userEmail) => {
    console.log("userEmail To Like", userEmail);
    const docRef = doc(db, "Users", userDoc?.email);
    const otherDocRef = doc(db, "Users", userEmail);
    try {
      const docSnap = await getDoc(docRef);
      const otherDocSnap = await getDoc(otherDocRef);

      if (docSnap.exists()) {
        let liked;

        if (!docSnap.data().liked) {
          liked = [];
        } else {
          liked = docSnap.data().liked;
        }

        if (liked.includes(userEmail)) {
          console.log("Already Liked");
        } else {
          await updateDoc(docRef, {
            liked: [...liked, userEmail],
          });
        }
      }

      if (otherDocSnap.exists()) {
        let liked_by;

        if (!otherDocSnap.data().liked_by) {
          liked_by = [];
        } else {
          liked_by = otherDocSnap.data().liked_by;
        }

        if (liked_by.includes(userDoc?.email)) {
          console.log("Already Liked By");
        } else {
          await updateDoc(otherDocRef, {
            liked_by: [...liked_by, userDoc?.email],
          });
        }
      } else {
        console.log("No such document!");
      }
      FlushUser(userEmail);
    } catch (e) {
      console.log("Error getting document:", e);
    }
  };

  const FlushUser = async (email) => {
    const docRef = doc(db, "Users", userDoc?.email);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let passed_email;

        if (!docSnap.data().passed_email) {
          passed_email = [];
        } else {
          passed_email = docSnap.data().passed_email;
        }

        if (passed_email.length >= 10) {
          passed_email.shift();
        }

        passed_email.push(email);

        await updateDoc(docRef, {
          passed_email: passed_email,
        });

        console.log("Email flushed successfully!");
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.log("Error getting document:", e);
    }
  };

  return (
    <>
     {/* ///Filter Screen//// */}
  {     !ispremium && filter && <>
       <div className={styles.filtermodalback}>
       </div>
       <div className={styles.filtermodal}>
            {
              <FilterPart setFilter={setFilter}/>
            }
          </div>
          </>
  }

      <div
        style={{ overflowY: !redo ? "scroll" : "hidden" }}
        className={styles.middleContainer}
      >
        {/* ////Not Premium Pop-UP//// */}
        {!ispremium && redo && (
          <FilterRedoPopUp
            frtext={frtext}
            SetRedo={SetRedo}
            setIsPremium={setIsPremium}
          />
        )}
        <div className={styles.filterContainer}>
          <div
            onClick={() => (CheckisPremium(), setFRText("Undo"))}
            className={styles.undoMoveCont}
          >
            <div className={styles.innerUndoMove}>
              <img
                className={styles.undoMoveImg}
                src={undoMoveIcon}
                alt="undoMoveIcon"
              />
              <p className={styles.undoMoveText}>Undo Move</p>
            </div>
          </div>
          <img
            onClick={()=>(CheckisPremiumFilter(),setFRText("Filter"))}
            className={styles.filterIcon}
            src={filterIcon}
            alt="filterIcon"
          />
        </div>
        {userData.length > 0 && (
          <div className={styles.vibeinfo}>
            <div className={styles.userDetailsContainer}>
              <div className={styles.imgContainer}>
                <img
                  className={styles.userProfilePucture}
                  src={
                    userData[currentUserIndex].image
                      ? userData[currentUserIndex].image
                      : defaultImg
                  }
                  alt="userProfilePucture"
                />
              </div>
              <h2 className={styles.userName}>
                {userData[currentUserIndex].name}
              </h2>
              <h3 className={styles.userPosition}>
                {userData[currentUserIndex].designation}
              </h3>
              {userData[currentUserIndex].state ||
              userData[currentUserIndex].country ? (
                <div className={styles.locationCont}>
                  <img
                    className={styles.locationIcon}
                    src={location}
                    alt="location"
                  />
                  <p className={styles.location}>
                    {userData[currentUserIndex].state}
                    {", "}
                    {userData[currentUserIndex].country}
                  </p>
                </div>
              ) : null}
            </div>
            <div className={styles.details}>
              {userData[currentUserIndex]?.about && (
                <div className={styles.aboutMe}>
                  <h2 className={styles.Heading}>About Me</h2>
                  <p className={styles.aboutDetails}>
                    {userData[currentUserIndex].about}
                  </p>
                </div>
              )}
              {userData[currentUserIndex]?.here_for &&
              userData[currentUserIndex]?.here_for.length > 0 ? (
                <div className={styles.whyamIHere}>
                  <h2 className={styles.Heading}>Why am i here</h2>
                  <div className={styles.whyamIHereCont}>
                    {userData[currentUserIndex]?.here_for.map((item, index) => {
                      return (
                        <div key={index} className={styles.whyamIHereItem}>
                          <p className={styles.whyhereText}>{item}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {userData[currentUserIndex]?.experience &&
              userData[currentUserIndex]?.experience.length > 0 &&
              userData[currentUserIndex]?.experience[0]?.designation &&
              userData[currentUserIndex]?.experience[0]?.company !== "" ? (
                <div className={styles.designation}>
                  <h2 className={styles.Heading}>Current Designation</h2>
                  <div className={styles.designationDetailsCont}>
                    <h3 className={styles.designationInfo}>
                      {userData[currentUserIndex].experience[0].designation
                        ? userData[currentUserIndex].experience[0].designation
                        : ""}
                    </h3>
                    <p className={styles.designationDetails}>
                      {userData[currentUserIndex].experience[0].company
                        ? userData[currentUserIndex].experience[0].company
                        : ""}
                    </p>
                  </div>
                </div>
              ) : null}
              {userData[currentUserIndex]?.education &&
              userData[currentUserIndex]?.education.length > 0 &&
              userData[currentUserIndex]?.education[0]?.institute &&
              userData[currentUserIndex]?.education[0]?.degree !== "" ? (
                <div className={styles.education}>
                  <h2 className={styles.Heading}>Education</h2>
                  <div className={styles.educationCont}>
                    <h3 className={styles.educationInstitute}>
                      {userData[currentUserIndex].education[0].institute
                        ? userData[currentUserIndex].education[0].institute
                        : ""}
                    </h3>
                    <p className={styles.designationDetails}>
                      {userData[currentUserIndex].education[0].degree
                        ? userData[currentUserIndex].education[0].degree
                        : ""}
                    </p>
                  </div>
                </div>
              ) : null}
              {userData[currentUserIndex]?.Vibe_Data?.How_To_Meet &&
              userData[currentUserIndex]?.Vibe_Data?.How_To_Meet?.length > 0 ? (
                <div className={styles.howCanWeMeet}>
                  <h2 className={styles.Heading}>How can we meet?</h2>
                  <div className={styles.meetingTypeCont}>
                    {userData[currentUserIndex].Vibe_Data.How_To_Meet.map(
                      (type, index) => {
                        const imageURL = howToMeetImages[type];
                        return (
                          <div key={index} className={styles.typeContainer}>
                            <img
                              className={styles.meetingTypeImg}
                              src={imageURL}
                              alt={type}
                            />
                            <p className={styles.meetingType}>{type}</p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              ) : null}
              <div className={styles.findMeOn}>
                {(userData[currentUserIndex]?.phone ||
                  userData[currentUserIndex]?.email ||
                  userData[currentUserIndex]?.linkedin ||
                  userData[currentUserIndex]?.twitter) !== "" && (
                  <>
                    <h2 className={styles.Heading}>Find Me On</h2>
                    <div className={styles.findmeOnWraper}>
                      {userData[currentUserIndex].phone !== "" && (
                        <div className={styles.findmeCont}>
                          <img src={phoneIcon} alt="phoneIcon" />
                          <p className={styles.findmeDetails}>
                            {userData[currentUserIndex].countryCode}{" "}
                            {userData[currentUserIndex].phone}
                          </p>
                        </div>
                      )}
                      {userData[currentUserIndex].email !== "" && (
                        <div className={styles.findmeCont}>
                          <img src={emailIcon} alt="emailIcon" />
                          <p className={styles.findmeDetails}>
                            {userData[currentUserIndex].email}
                          </p>
                        </div>
                      )}
                      {userData[currentUserIndex].linkedin !== "" && (
                        <div className={styles.findmeCont}>
                          <img src={linkedinIcon} alt="linkedinIcon" />
                          <p className={styles.findmeDetails}>
                            {userData[currentUserIndex].linkedin}
                          </p>
                        </div>
                      )}
                      {userData[currentUserIndex].twitter !== "" && (
                        <div className={styles.findmeCont}>
                          <img src={twitterIcon} alt="twitterIcon" />
                          <p className={styles.findmeDetails}>
                            {userData[currentUserIndex].twitter}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={styles.likeHandshake}>
          <div className={styles.innerContainer}>
            <div className={styles.Cont} onClick={handleNopeCkick}>
              <img
                className={styles.likehandShakeImg}
                src={nopeIcon}
                alt="nopeIcon"
              />
              <p className={styles.text}>Nope</p>
            </div>
            <div className={styles.Cont} onClick={HandShakeUser}>
              <img
                className={styles.likehandShakeImg}
                src={handShakeIcon}
                alt="handShakeIcon"
              />
              <p className={styles.text}>Handshake</p>
            </div>
            <div className={styles.Cont} onClick={handleLikeCkick}>
              <img
                className={styles.likehandShakeImg}
                src={blueLikeIcon}
                alt="blueLikeIcon"
              />
              <p className={styles.text}>Like</p>
            </div>
          </div>
          <div className={styles.background}></div>
        </div>
      </div>
    </>
  );
};

export default VibeMiddlePart;