import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieDetail, getTvDetail, IGetMovieDetail } from "../api";
import { makeImagePath } from "../utils";
import { useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  border-radius: 20px;
  height: 100%;
`;
const BigCover = styled.div`
  width: 100%;
  height: 300px;
  background-position: center center;
  background-size: cover;
`;
const Loader = styled.div`
  height: 100%;
  width: 100%;
`;

const BigTitle = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 95%;
  font-size: 45px;
  color: ${(props) => props.theme.white.lighter};
  position: absolute;
  left: 20px;
  top: 230px;
`;
const BigOverView = styled.p`
  padding: 10px 20px;
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigGenres = styled.ul`
  display: flex;
  position: relative;
  padding: 10px 20px;
`;

const Genre = styled.li`
  margin-right: 10px;
  background-color: black;
  font-size: 15px;
  font-weight: 700;
  border-radius: 5px;
  padding: 8px 8px;
`;

const Detail = () => {
  const movieId = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const tvId = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  console.log(movieId, tvId);
  const { data, isLoading: movieLoading } = useQuery<IGetMovieDetail>(
    ["movieDetail"],
    () =>
      movieId
        ? getMovieDetail(movieId.params.movieId + "")
        : getTvDetail(tvId?.params.tvId + ""),
    { keepPreviousData: true }
  );

  return (
    <>
      {movieLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Wrapper>
          <BigCover
            style={{
              backgroundImage: data?.backdrop_path
                ? `linear-gradient(to top,black, transparent), url(${makeImagePath(
                    data.backdrop_path
                  )})`
                : "",
            }}
          />
          <BigTitle>{movieId ? data?.title : data?.name}</BigTitle>
          <BigGenres>
            {data &&
              data?.genres.map((genre) => (
                <Genre key={genre.id}>{genre.name}</Genre>
              ))}
          </BigGenres>
          <BigOverView>{data && data?.overview}</BigOverView>
          <div style={{ padding: "10px 20px" }}>
            Vote Average: {data?.vote_average}
          </div>
          <h1 style={{ padding: "10px 20px" }}>Home Page :</h1>
          <a
            style={{ textDecorationLine: "underline", padding: "20px" }}
            href={data?.homepage}
            target="_blank"
          >
            {data?.homepage}
          </a>
        </Wrapper>
      )}
    </>
  );
};

export default Detail;
