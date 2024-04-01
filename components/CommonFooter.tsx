import {
  CautionText,
  CreditContainer,
  FeedbackLink,
} from "./CommonFooter.styled";

const CommonFooter = () => (
  <CreditContainer>
    <CautionText>※このTrainLEDはカナリア版です。</CautionText>
    <FeedbackLink href="https://forms.gle/a887VmUTWppB7v5Z8">
      カナリア版のフィードバックはこちら
    </FeedbackLink>
  </CreditContainer>
);

export default CommonFooter;
