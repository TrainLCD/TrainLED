import { useAtomValue } from 'jotai';
import { lineAtom } from '../atoms/line';
import { stationAtom } from '../atoms/station';
import { PARENTHESIS_REGEXP } from '../constants';
import Heading from './Heading';

const CommonHeader = () => {
  const { station } = useAtomValue(stationAtom);
  const { selectedLine } = useAtomValue(lineAtom);

  return (
    <>
      <Heading>
        {selectedLine
          ? selectedLine.nameShort.replace(PARENTHESIS_REGEXP, '')
          : 'TrainLED'}
      </Heading>
      {station && <Heading>{station?.name}</Heading>}
    </>
  );
};

export default CommonHeader;
