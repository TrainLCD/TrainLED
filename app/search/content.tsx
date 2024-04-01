"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import CommonFooter from "../../components/CommonFooter";
import CommonHeader from "../../components/CommonHeader";
import Container from "../../components/Container";
import Heading from "../../components/Heading";
import useSearchStation from "../../hooks/useSearchStation";

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

export const PageContent = () => {
  const { stations, isLoading, search, submitStation } = useSearchStation();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [alreadySearched, setAlreadySearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value),
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      inputRef.current?.blur();
      await search(query);
      setAlreadySearched(true);
    },
    [query, search]
  );

  return (
    <Container>
      <CommonHeader />
      <Heading>駅を指定</Heading>
      <SearchForm onSubmit={handleSubmit}>
        <StationNameInput
          ref={inputRef}
          onChange={handleChange}
          placeholder="駅名を入力"
        />
        <SearchResultListContainer>
          {!stations.length &&
            query.length === 0 &&
            !alreadySearched &&
            !isLoading && (
              <SearchResultListContent centering>
                駅名を入力してください
              </SearchResultListContent>
            )}
          {!stations.length && alreadySearched && !isLoading && (
            <SearchResultListContent centering>
              結果がありません
            </SearchResultListContent>
          )}
          {stations.map((station) => (
            <SearchResultListContent
              onClick={() => submitStation(station)}
              key={station.id}
            >
              {station.name}
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
