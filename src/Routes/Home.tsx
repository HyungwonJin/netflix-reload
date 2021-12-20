import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getTopRated,
  getUpcoming,
  IGetMoviesResult,
  IGetTopRated,
} from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;
const Slider2 = styled.div`
  position: relative;
  top: 300px;
`;
const Slider3 = styled.div`
  position: relative;
  top: 700px;
`;

const NextBtn = styled.div`
  position: absolute;
  right: 0;
  top: 130px;
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
  top: 10px;
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
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const SliderTitle = styled.div`
  color: white;
  font-size: 60px;
  font-weight: 500;
  position: absolute;
  top: -80px;
  z-index: 1;
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

const Home = () => {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: rateData, isLoading: rateLoading } = useQuery<IGetTopRated>(
    ["movies", "topRated"],
    getTopRated
  );
  const { data: upData, isLoading: upLoading } = useQuery<IGetMoviesResult>(
    ["movies", "upRated"],
    getUpcoming
  );
  const [index, setIndex] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndex2 = () => {
    if (rateData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = rateData?.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndex3 = () => {
    if (upData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upData?.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex3((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndex2 = () => {
    if (rateData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = rateData?.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex2((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndex3 = () => {
    if (upData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upData?.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex3((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (data?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    ) ||
      rateData?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId
      ) ||
      upData?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId
      ));
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
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
                  .slice(1)
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
            <SliderTitle>Top Rate Movies</SliderTitle>
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
                {rateData?.results
                  .slice(offset * index2, offset * index2 + offset)
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
          </Slider2>
          <Slider3>
            <SliderTitle>Upcoming Movies</SliderTitle>
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
                {upData?.results
                  .slice(offset * index3, offset * index3 + offset)
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
          </Slider3>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 80 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>Overview{clickedMovie.overview}</BigOverview>
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

export default Home;
