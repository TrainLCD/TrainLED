import styled from "styled-components";

const CreditContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 32px;
`;

const CautionText = styled.p`
  line-height: 1.5;
  text-align: center;
`;

const TrainLCDLink = styled.a`
  line-height: 1.5;
  text-align: center;
`;

const CommonFooter = () => (
  <CreditContainer>
    <CautionText>※TrainLEDはβ版です。</CautionText>
    <TrainLCDLink
      href="https://trainlcd.app/"
      rel="noopener noreferrer"
      target="_blank"
    >
      TrainLCDアプリをダウンロード
    </TrainLCDLink>
  </CreditContainer>
);

export default CommonFooter;
