import { useViewportScroll, motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { getSearchMovie, getSearchTv, ISearchMovie, ISearchTv } from "../api";
import { useState } from "react";
import { makeImagePath } from "../utils";

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

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 200px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 28px;
  position: relative;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -50px;
  color: ${(props) => props.theme.white.lighter};
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

const Search = () => {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ searchId: string }>("/search/:searchId");
  const { scrollY } = useViewportScroll();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<ISearchMovie>(
    ["search", "searchMovie"],
    () => getSearchMovie(keyword || "")
  );

  const { data: tvData, isLoading: tvLoading } = useQuery<ISearchTv>(
    ["search", "searchTv"],
    () => getSearchTv(keyword || "")
  );
  const [index, setIndex] = useState(0);
  const [index2, setIndex2] = useState(0);
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
    if (tvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = tvData?.results.length - 1;
      const maxIndex = Math.ceil(totalTvs / offset) - 1;
      setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
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
    if (tvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = tvData?.results.length - 1;
      const maxIndex = Math.ceil(totalTvs / offset) - 1;
      setIndex2((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (searchId: number) => {
    history.push(`/search/${searchId}`);
  };
  const onOverlayClick = () => history.goBack();
  const clickedresult =
    bigTvMatch?.params.searchId &&
    (data?.results.find((movie) => movie.id === +bigTvMatch.params.searchId) ||
      tvData?.results.find(
        (movie) => movie.id === +bigTvMatch.params.searchId
      ));
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider>
            <SliderTitle>Search Result on Movie: {keyword}</SliderTitle>
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
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider2>
            <SliderTitle>Search Result on TV: {keyword} </SliderTitle>
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
                {tvData?.results
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
                  layoutId={bigTvMatch.params.searchId}
                >
                  {clickedresult && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedresult.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle></BigTitle>
                      <BigOverview>{clickedresult.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Search;
