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
  margin: 8px 0;
`;

const CommonFooter = () => (
  <CreditContainer>
    <CautionText>※TrainLEDはβ版です。</CautionText>
    <CautionText>スマホを横向きにすると楽しいよ</CautionText>
  </CreditContainer>
);

export default CommonFooter;
