import i18n from "@dhis2/d2-i18n";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRow,
  TableBody,
  TableHead,
} from "@dhis2/ui";
import PropTypes from "prop-types";
import React from "react";
import { useRecoilValue } from "recoil";
import { dataElementsStateDictionary } from "../../../Store";
import Row from "./row";

export default function DataElementSIndicator({ resourceType }) {
  const dataElements = useRecoilValue(dataElementsStateDictionary);

  if (dataElements?.length === 0) {
    return (
      <div>
        <h3>
          {" "}
          {i18n.t("Data elements in {{variables}}", {
            variables: resourceType,
          })}{" "}
        </h3>
        <p>
          {i18n.t(
            "There were no Data Elements in the {{variables}} Calculations",
            { resourceType }
          )}{" "}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3>
        {" "}
        {i18n.t("Data elements in {{variables}}", {
          variables: resourceType,
        })}{" "}
      </h3>
      <p>
        {" "}
        {i18n.t(
          "The following is the summary of the data elements used in calculations:"
        )}{" "}
      </p>

      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader bordered>
              {i18n.t("Data Element")}
            </DataTableColumnHeader>
            <DataTableColumnHeader bordered>
              {i18n.t("Expression part (Numerator/ Denominator)")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
              {i18n.t("Value Type")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
              {i18n.t("Zero Significance")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
              {i18n.t("Categories")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
              {i18n.t("Datasets/ Programs")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t("Groups")}</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody>
          {dataElements?.map((dtEle, index) => {
            return <Row key={index} datEl={dtEle} location={dtEle?.location} />;
          })}
        </TableBody>
      </DataTable>
    </div>
  );
}

DataElementSIndicator.PropTypes = {
  resourceType: PropTypes.string.isRequired,
};
