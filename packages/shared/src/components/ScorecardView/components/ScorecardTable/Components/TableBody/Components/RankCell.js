import {head, last, round} from "lodash";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {useRecoilValue} from "recoil";
import {LinkedCellSvg, SingleCellSvg} from "../../../../../../index";
import {OrgUnitLevels, ScorecardLegendDefinitionSelector, ScorecardViewState} from "../../../../../../../state";
import {getLegend} from "../../../../../../../utils";


const RankCalculator = ({ value, weight, odds }) => {
    const [items, setItems] = useState([]);
  
    const calculateRank = () => {
      const rank = value / weight * odds;
      const item = {
        value,
        weight,
        odds,
        rank,
      };
      setItems([...items, item]);
    };
    <ul>
        {items.map((item) => (
          <li key={item.id}>
            Value: {item.value}
            Weight: {item.weight}
            Odds: {item.odds}
            Rank: {item.rank}
          </li>
        ))}
      </ul>
}


    const sortItems = () => {
      setItems(items.sort((a, b) => a.rank - b.rank));
    };

function SingleRankCell({cellRef, dataSources, values, bold, period, orgUnit}) {

    const [dataSource] = dataSources ?? [];
    const defaultLegendDefinitions = useRecoilValue(
        ScorecardLegendDefinitionSelector(true)
    );

    const orgUnitLevels = useRecoilValue(OrgUnitLevels);
    const legendDefinitions = useRecoilValue(
        ScorecardViewState("legendDefinitions")
    );

    const {color: cellColor} =
    getLegend(head(values), dataSource?.legends, {
        max: dataSource?.weight,
        defaultLegends: defaultLegendDefinitions,
        dataOrgUnitLevel: {},
        orgUnitLevels,
        legendDefinitions,
        specificTargets: dataSource?.specificTargets,
        period,
        orgUnit
    }) ?? {};
    if (head(values) === undefined) {
        return null;
    }

    return <SingleCellSvg
        cellRef={cellRef}
        color={cellColor}
        bold={bold}
        value={head(values) !== undefined ? round(head(values), 2) : ""}
    />
}

function LinkedRankCell({cellRef, dataSources, values, bold, period, orgUnit}) {
    const defaultLegendDefinitions = useRecoilValue(
        ScorecardLegendDefinitionSelector(true)
    );
    const orgUnitLevels = useRecoilValue(OrgUnitLevels);
    const legendDefinitions = useRecoilValue(
        ScorecardViewState("legendDefinitions")
    );
    const [topDataSource, bottomDataSource] = dataSources ?? [];

    const {color: topCellColor} =
    getLegend(head(values), topDataSource?.legends, {
        max: topDataSource?.weight,
        defaultLegends: defaultLegendDefinitions,
        dataOrgUnitLevel: {},
        orgUnitLevels,
        legendDefinitions,
        orgUnit,
        period,
        specificTargets: topDataSource?.specificTargets
    }) ?? {};

    const {color: bottomCellColor} =
    getLegend(last(values), bottomDataSource?.legends, {
        max: bottomDataSource?.weight,
        defaultLegends: defaultLegendDefinitions,
        dataOrgUnitLevel: {},
        orgUnitLevels,
        legendDefinitions,
        orgUnit,
        period,
        specificTargets: bottomDataSource?.specificTargets,
    }) ?? {};
    

    return (
        <LinkedCellSvg
            cellRef={cellRef}
            topColor={topCellColor}
            bottomColor={bottomCellColor}
            bold={bold}
            topValue={head(values) ? round(+head(values), 2) : ""}
            bottomValue={last(values) ? round(last(values), 2) : ""}
        />
    )


}

SingleRankCell.propTypes = {
    values: PropTypes.arrayOf(PropTypes.any).isRequired,
    bold: PropTypes.bool,
    dataSources: PropTypes.arrayOf(PropTypes.any),
    orgUnit: PropTypes.string,
    period: PropTypes.string,
};
LinkedRankCell.propTypes = {
    values: PropTypes.arrayOf(PropTypes.any).isRequired,
    bold: PropTypes.bool,
    dataSources: PropTypes.arrayOf(PropTypes.any),
    orgUnit: PropTypes.string,
    period: PropTypes.string,
};


function ComplexRankCell({value, bold, dataSources, period, orgUnit}) {
    const values = Object.values(value);

    const [tableCellRef, setTableCellRef] = useState();

    return (
        <td ref={setTableCellRef} className="data-cell" align="center">
            {values.length > 1 ? (
                <LinkedRankCell cellRef={tableCellRef} period={period} orgUnit bold={bold} dataSources={dataSources}
                                   values={values}/>
            ) : (
                <SingleRankCell cellRef={tableCellRef} period={period} orgUnit={orgUnit} bold={bold}
                                   dataSources={dataSources}
                                   values={values}/>
            )}
        </td>
    );
}

ComplexRankCell.propTypes = {
    value: PropTypes.any.isRequired,
    bold: PropTypes.bool,
    dataSources: PropTypes.arrayOf(PropTypes.any),
    orgUnit: PropTypes.string,
    period: PropTypes.string,
};



export default function RankCell({value, bold, dataSources, orgUnit, period}) {

    const [singleCellRef, setSingleCellRef] = useState();

    if (value === undefined) {
        return null;
    }

    if (typeof value === "number") {

        return (
            <td ref={setSingleCellRef} className="data-cell" align="center">
                <SingleCellSvg cellRef={singleCellRef} bold={bold} value={value ? round(value, 2) : ""}/>
            </td>
        );
    }

    return <ComplexRankCell orgUnit={orgUnit} period={period} value={value} bold={bold} dataSources={dataSources}/>
}

RankCell.propTypes = {
    value: PropTypes.any.isRequired,
    bold: PropTypes.bool,
    dataSources: PropTypes.arrayOf(PropTypes.any),
    orgUnit: PropTypes.string,
    period: PropTypes.string,
};
