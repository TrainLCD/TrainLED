import Link from "next/link";
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
const FeedbackLink = styled(Link)`
  line-height: 1.5;
  text-align: center;
  margin: 8px 0;
  text-decoration: underline;
`;

const CommonFooter = () => (
  <CreditContainer>
    <CautionText>※このTrainLEDはカナリア版です。</CautionText>
    <FeedbackLink href="https://forms.gle/a887VmUTWppB7v5Z8">
      カナリア版のフィードバックはこちら
    </FeedbackLink>
  </CreditContainer>
);

export default CommonFooter;
