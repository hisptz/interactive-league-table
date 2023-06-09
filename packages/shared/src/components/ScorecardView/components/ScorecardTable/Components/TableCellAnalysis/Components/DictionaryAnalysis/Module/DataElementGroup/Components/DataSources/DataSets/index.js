import { useDataEngine, useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Error from "../../../../../Shared/Componets/Error/ErrorAPIResult";
import Loader from "../../../../../Shared/Componets/Loaders/Loader";
import { dataSetDataElementCountState } from "../../../../../Store";
import { useGetDataSet } from "../../../../../Utils/Hooks";

export default function DataSets({ aggregate }) {
  const updateCount = useSetRecoilState(dataSetDataElementCountState);

  const engine = useDataEngine();

  const onlyIds = aggregate?.map((el) => {
    return el?.id;
  });

  const { loading, error, data } = useGetDataSet(onlyIds, engine);

  const res = data?.dataSets;
  useEffect(() => {
    let totalCount = 0;
    res?.map((e) => {
      totalCount += e?.length;
    });
    updateCount(totalCount);
    return () => {};
  }, [data]);

  if (loading) {
    return <Loader text={""} />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    <div>
      <ul>
        {aggregate?.map((el, index) => {
          return (
            <li key={el?.id + index}>
              {el?.displayName}
              <ul>
                {" "}
                {res[index]?.length > 1 ? i18n.t("sources") : ""}
                {res[index]?.map((datset) => {
                  return (
                    <li key={datset?.id}>
                      {datset?.displayName} {i18n.t(" submitting ")}{" "}
                      {datset?.periodType} {i18n.t(" after every ")}{" "}
                      {datset?.timelyDays} {i18n.t("days")}{" "}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

DataSets.propTypes = {
  aggregate: PropTypes.array.isRequired,
};
