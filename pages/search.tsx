import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { stationAtom } from "../atoms/station";
import Button from "../components/Button";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";
import Container from "../components/Container";
import Heading from "../components/Heading";
import useSearchStation from "../hooks/useSearchStation";
import StationForSearch from "../models/StationForSearch";

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
`;

const StationNameInput = styled.input`
  appearance: none;
  border: 1px solid#fff;
  background: none;
  color: white;
  padding: 12px;
  font-size: 1rem;
  font-family: "JF-Dot-jiskan24";
  width: 320px;
  border-radius: 0;

  ::placeholder {
    opacity: 0.5;
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;

const SearchResultListContainer = styled.ul`
  width: 320px;
  list-style-type: none;
  padding: 0;
  border: 1px solid #fff;
  height: 240px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const SearchResultListContent = styled.li<{ centering?: boolean }>`
  padding: 12px;
  border-bottom: 1px solid #fff;
  text-align: ${({ centering }) => (centering ? "center" : "left")};
`;

const BackButtonContainer = styled.div`
  align-self: center;
`;

const SearchPage = () => {
  const { search } = useSearchStation();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<StationForSearch[]>([]);
  const [alreadySearched, setAlreadySearched] = useState(false);

  const setStationAtom = useSetAtom(stationAtom);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value),
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      inputRef.current?.blur();
      const result = await search(query);
      if (result) {
        setSearchResult(result);
      }
      setAlreadySearched(true);
    },
    [query, search]
  );

  const handleStationClick = useCallback(
    (station: StationForSearch) => {
      const { nameForSearch, ...reducedStation } = station;
      setSearchResult([]);
      setQuery("");

      setStationAtom((prev) => ({
        ...prev,
        station: reducedStation,
      }));
      router.push("/");
    },
    [router, setStationAtom]
  );

  return (
    <Container>
      <CommonHeader />
      <Heading>駅を指定</Heading>
      <SearchForm onSubmit={handleSubmit}>
        <StationNameInput
          ref={inputRef}
          onChange={handleChange}
          placeholder="実は入力できるんすよ"
        />
        <SearchResultListContainer>
          {!searchResult.length && query.length === 0 && !alreadySearched && (
            <SearchResultListContent centering>
              駅名を入力してください
            </SearchResultListContent>
          )}
          {!searchResult.length && alreadySearched && (
            <SearchResultListContent centering>
              結果がないゾイ
            </SearchResultListContent>
          )}
          {searchResult.map((station) => (
            <SearchResultListContent
              onClick={handleStationClick.bind(this, station)}
              key={station.id}
            >
              {station.nameForSearch}
            </SearchResultListContent>
          ))}
        </SearchResultListContainer>
      </SearchForm>
      <BackButtonContainer>
        <Button onClick={router.back}>戻る</Button>
      </BackButtonContainer>
      <CommonFooter />
    </Container>
  );
};

export default SearchPage;
