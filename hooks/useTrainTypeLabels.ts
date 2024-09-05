import { useMemo } from "react";
import { PARENTHESIS_REGEXP } from "../constants";
import { Line, TrainType } from "../generated/proto/stationapi_pb";
import { useCurrentLine } from "./useCurrentLine";

const useTrainTypeLabels = (trainTypes: TrainType[]) => {
  const currentLine = useCurrentLine();

  const labels = useMemo(
    () =>
      trainTypes.map((tt) => {
        const solo = tt.lines.length === 1;
        if (solo || !tt.id) {
          return tt.name;
        }

        const allTrainTypeIds = tt.lines.map((l) => l.trainType?.typeId);
        const allCompanyIds = tt.lines.map((l) => l.company?.id);
        const isAllSameTrainType = allTrainTypeIds.every(
          (v, i, a) => v === a[0]
        );
        const isAllSameOperator = allCompanyIds.every((v, i, a) => v === a[0]);

        const duplicatedCompanyIds = tt.lines
          .map((l) => l.company?.id)
          .filter((id, idx, self) => self.indexOf(id) !== idx);
        const duplicatedTypeIds = tt.lines
          .map((l) => l.trainType?.typeId)
          .filter((id, idx, self) => self.indexOf(id) !== idx);

        const reducedBySameOperatorLines = tt.lines.reduce<Line[]>(
          (lines, line) => {
            const isCurrentOperatedSameCompany = duplicatedCompanyIds.every(
              (id) => id === line.company?.id
            );
            const hasSameTypeLine = duplicatedTypeIds.every(
              (id) => id === line.trainType?.typeId
            );

            const hasSameCompanySameTypeLine =
              isCurrentOperatedSameCompany && hasSameTypeLine;

            const hasPushedMatchedStation = lines.some(
              (l) =>
                duplicatedCompanyIds.includes(l.company?.id) &&
                duplicatedTypeIds.includes(l.trainType?.typeId)
            );

            if (hasPushedMatchedStation) {
              return lines;
            }

            if (hasSameCompanySameTypeLine) {
              line.company &&
                lines.push(
                  new Line({
                    ...line,
                    nameShort: `${line.company?.nameShort}線`,
                    nameRoman: `${line.company?.nameEnglishShort} Line`,
                  })
                );
              return lines;
            }

            lines.push(line);
            return lines;
          },
          []
        );

        if (isAllSameTrainType && !isAllSameOperator) {
          const otherLinesText = reducedBySameOperatorLines
            .filter((line, idx, self) =>
              self.length === 1 ? true : line.id !== currentLine?.id
            )
            .map((l) => l.nameShort.replace(PARENTHESIS_REGEXP, ""))
            .filter((txt, idx, self) => self.indexOf(txt) === idx)
            .join("・");

          if (!otherLinesText.length) {
            return `${tt.name}`;
          }

          return `${tt.name} ${otherLinesText}直通`;
        }

        if (isAllSameTrainType && isAllSameOperator) {
          const otherLinesText = tt.lines
            .filter((l) => l.id !== currentLine?.id)
            .map((l) => l.nameShort.replace(PARENTHESIS_REGEXP, ""))
            .filter((txt, idx, self) => self.indexOf(txt) === idx)
            .join("・");

          if (!otherLinesText.length) {
            return `${tt.name}`;
          }

          return `${tt.name} ${otherLinesText}直通`;
        }

        const otherLinesText = reducedBySameOperatorLines
          .filter((l) => l.id !== currentLine?.id)
          .map(
            (l) =>
              `${l.nameShort.replace(
                PARENTHESIS_REGEXP,
                ""
              )} ${l.trainType?.name.replace(PARENTHESIS_REGEXP, "")}`
          )
          .join("・");
        return `${tt.name} ${otherLinesText}`;
      }),
    [currentLine?.id, trainTypes]
  );

  return labels;
};

export default useTrainTypeLabels;
