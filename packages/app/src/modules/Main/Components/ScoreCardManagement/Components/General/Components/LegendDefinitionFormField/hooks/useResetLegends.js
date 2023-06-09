import {useCallback} from "react";
import {useFormContext} from "react-hook-form";
import {resetLegends} from "../../../utils/utils";


export function useResetLegends() {
    const {watch, setValue} = useFormContext();
    const dataGroups = watch("dataSelection.dataGroups");
    const shouldVerify = dataGroups.length > 0;

    const onResetLegends = useCallback((updatedDefinitions) => {
        const newGroups = resetLegends(dataGroups, updatedDefinitions);
        setValue("dataSelection.dataGroups", newGroups);
    }, [dataGroups, setValue]);

    return {
        onResetLegends,
        shouldVerify
    }
}
