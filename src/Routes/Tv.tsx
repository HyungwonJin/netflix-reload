import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getAiringToday, getPopular, getTopRatedTv, ITvResult } from "../api";
import { makeImagePath } from "../utils";
import Detail from "../Components/Detail";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SliderTitle = styled.div`
  color: white;
  font-size: 60px;
  font-weight: 500;
  z-index: 99;
`;

const Slider = styled.div`
  position: relative;
  margin-top: 80px;
`;

const Slider2 = styled.div`
  position: relative;
  margin-top: 350px;
`;

const Slider3 = styled.div`
  position: relative;
  margin-top: 350px;
`;

const NextBtn = styled.div`
  position: absolute;
  right: 0;
  top: 190px;
  background-color: rgba(0, 0, 0, 0.5);
  width: 60px;
  height: 60px;
  z-index: 99;
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const PrevBtn = styled.div`
  position: absolute;
  left: 0;
  top: 190px;
  background-color: rgba(0, 0, 0, 0.5);
  width: 60px;
  height: 60px;
  z-index: 99;
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 300px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  font-size: 64px;
  &:last-child {
    transform-origin: center right;
  }
  &:first-child {
    transform-origin: center left;
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 101;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 102;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

const Tv = () => {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<ITvResult>(
    ["tv", "latest"],
    getAiringToday
  );
  const { data: popularData, isLoading: popularLoading } = useQuery<ITvResult>(
    ["tv", "popular"],
    getPopular
  );
  const { data: rateData, isLoading: rateLoading } = useQuery<ITvResult>(
    ["tv", "topRated"],
    getTopRatedTv
  );
  const [index, setIndex] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = data?.results.length - 1;
      const maxIndex = Math.ceil(totalTvs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndex2 = () => {
    if (popularData) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = popularData?.results.length - 1;
      const maxIndex = Math.ceil(totalTvs / offset) - 1;
      setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndex3 = () => {
    if (rateData) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = rateData?.results.length - 1;
      const maxIndex = Math.ceil(totalTvs / offset) - 1;
      setIndex3((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = data?.results.length - 1;
      const maxIndex = Math.ceil(totalTvs / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndex2 = () => {
    if (popularData) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = popularData?.results.length - 1;
      const maxIndex = Math.ceil(totalTvs / offset) - 1;
      setIndex2((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndex3 = () => {
    if (rateData) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = rateData?.results.length - 1;
      const maxIndex = Math.ceil(totalTvs / offset) - 1;
      setIndex3((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider>
            <SliderTitle>Airing Today</SliderTitle>
            <NextBtn onClick={increaseIndex}>&rarr;</NextBtn>
            <PrevBtn onClick={decreaseIndex}>&larr;</PrevBtn>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider2>
            <SliderTitle>Popular TVs</SliderTitle>
            <NextBtn onClick={increaseIndex2}>&rarr;</NextBtn>
            <PrevBtn onClick={decreaseIndex2}>&larr;</PrevBtn>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index2}
              >
                {popularData?.results
                  .slice(offset * index2, offset * index2 + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider2>
          <Slider3>
            <SliderTitle>Top Rate TVs</SliderTitle>
            <NextBtn onClick={increaseIndex3}>&rarr;</NextBtn>
            <PrevBtn onClick={decreaseIndex3}>&larr;</PrevBtn>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index3}
              >
                {rateData?.results
                  .slice(offset * index3, offset * index3 + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider3>

          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 80 }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  <Detail />
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Tv;
