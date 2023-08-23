import React from "react";
import { useState } from "react";
import styles from "./CheckScoreTesting.module.css";
import PnTTesting from "./stages/PnTTesting";
import TeamTesting from "./stages/TeamTesting";
import MarketTesting from "./stages/MarketTesting";
import FinanceTesting from "./stages/FinanceTesting";
import ResultTesting from "./stages/ResultTesting";
import DoneTesting from "./stages/DoneTesting";
import NavBarFinalDarkMode from "../../components/Navbar Dark Mode/NavBarFinalDarkMode";
import GroupImg from "../../images/Group.webp";
import collaborateImg from "../../images/Collaborate.webp";

const CheckYourScoreTesting = () => {
  const [stage, setStage] = useState(0);
  const [startupScore, setstartupScore] = useState({
    productTech: { totalScore: 0, score: 0 },
    Team: { totalScore: 0, score: 0 },
    Market: { totalScore: 0, score: 0 },
    Finance: { totalScore: 0, score: 0 },
    totalScore: 0,
    score: 0,
  });
  const [algoScore, setAlgoScore] = useState({
    Pnt: 0,
    Team: 0,
    Market: 0,
    Finance: 0,
  });

  const stages = [
    <PnTTesting
      setStage={setStage}
      data={startupScore}
      setData={setstartupScore}
      score={algoScore}
      setScore={setAlgoScore}
    />,
    <TeamTesting
      setStage={setStage}
      data={startupScore}
      setData={setstartupScore}
      score={algoScore}
      setScore={setAlgoScore}
    />,
    <MarketTesting
      setStage={setStage}
      data={startupScore}
      setData={setstartupScore}
      score={algoScore}
      setScore={setAlgoScore}
    />,
    <FinanceTesting
      setStage={setStage}
      data={startupScore}
      setData={setstartupScore}
      score={algoScore}
      setScore={setAlgoScore}
    />,
    <DoneTesting
      setStage={setStage}
      // data={scoreData}
      // setData={setScoreData}
    />,
    <ResultTesting
      score={algoScore}
      data={startupScore}
      setData={setstartupScore}
    />,
  ];

  const progressPercentage = [
    {p: 0},
    {p: 25},
    {p: 50},
    {p: 75},
    {p: 100}
  ]
  const progressWidth = progressPercentage[stage].p + '%';

  
  return (
    <>
      <section id={styles.checkyourscore}>
        <NavBarFinalDarkMode />
        {/* <img
          className={styles.checkscoreicon1}
          src="/images/algo-bg1.png"
          alt=""
        />
        <img
          className={styles.checkscoreicon2}
          src="/images/algo-bg2.png"
          alt=""
        /> */}

        <div className={styles.checkscore__container}>
          <h1>
            {" "}
            Take Your Start-Up <span>Assessment </span>today!
          </h1>
          <div className={styles.checkscore__content}>
            <img className={styles.GroupImg} src={GroupImg} alt="GroupImg" />
            <img className={styles.collaborateImg} src={collaborateImg} alt="collaborateImg" />
            <div className={styles.stages}>
              <div className={styles.stageWraper}>
                {stage >= 0 ? (
                  <>
                    <img src={"/images/blue_circle.svg"} alt="ProgressImg" />
                    <img src={"/images/tick.svg"} alt="ProgressImg" />
                  </>
                ) : (
                  <>
                    <div className={styles.imageBackground}>
                    <img className={styles.imageBackgroundImg} src={"/images/empty_circle.svg"} alt="ProgressImg" />
                    </div>
                  </>
                )}
                <span>Product</span>
              </div>
              <div className={styles.stageWraper}>
                {stage >= 1 ? (
                  <>
                    <img src={"/images/blue_circle.svg"} alt="ProgressImg" />
                    <img src={"/images/tick.svg"} alt="ProgressImg" />
                  </>
                ) : (
                  <>
                    <div className={styles.imageBackground}>
                    <img className={styles.imageBackgroundImg} src={"/images/empty_circle.svg"} alt="ProgressImg" />
                    </div>
                  </>
                )}
                <span>Team</span>
              </div>
              <div className={styles.stageWraper}>
                {stage >= 2 ? (
                  <>
                    <img src={"/images/blue_circle.svg"} alt="ProgressImg" />
                    <img src={"/images/tick.svg"} alt="ProgressImg" />
                  </>
                ) : (
                  <>
                  <div className={styles.imageBackground}>
                  <img className={styles.imageBackgroundImg} src={"/images/empty_circle.svg"} alt="ProgressImg" />
                  </div>
                    
                  </>
                )}
                <span>Market</span>
              </div>
              <div className={styles.stageWraper}>
                {stage >= 3 ? (
                  <>
                    <img src={"/images/blue_circle.svg"} alt="ProgressImg" />
                    <img src={"/images/tick.svg"} alt="ProgressImg" />
                  </>
                ) : (
                  <>
                    <div className={styles.imageBackground}>
                    <img className={styles.imageBackgroundImg} src={"/images/empty_circle.svg"} alt="ProgressImg" />
                    </div>
                  </>
                )}
                <span>Finance</span>
              </div>
              <div className={styles.stageWraper}>
                {stage >= 4 ? (
                  <>
                    <img src={"/images/blue_circle.svg"} alt="ProgressImg" />
                    <img src={"/images/tick.svg"} alt="ProgressImg" />
                  </>
                ) : (
                  <>
                   <div className={styles.imageBackground}>
                   <img className={styles.imageBackgroundImg} src={"/images/empty_circle.svg"} alt="ProgressImg" />
                   </div>
                  </>
                )}
                <span>Done</span>
              </div>
              <div className={styles.progress} style={{width: progressWidth, height: "3px", backgroundColor: "rgba(76, 201, 255, 1)"}}>

              </div>
            </div>
            {/* <div className={styles.progress_bar}>
              <div style={{ width: `calc(${(stage + 1) / 4} * 100%)` }}></div>
            </div> */}
            <div className={styles.stage}>{stages[stage]}</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckYourScoreTesting;