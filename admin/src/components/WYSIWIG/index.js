import React, {useState, useCallback, useEffect} from "react";
import PropTypes from "prop-types";
import {isEmpty} from "lodash";
import Editor from "../EditorJS";
import WysiwigDescription from "../FieldUI/Description";
import WysiwigErrors from "../FieldUI/Errors";
import WysiwigLabel from "../FieldUI/Label";

const Spacer = ({inputDescription, noErrorsDescription, errors}) => {
    if (isEmpty(inputDescription) || (
        !noErrorsDescription && !isEmpty(errors)
    )) {
        return <div />;
    }

    return <div style={{height: ".4rem"}} />;
};

const WysiwygWithErrors = ({
                               inputDescription,
                               errors,
                               label,
                               labelIcon,
                               name,
                               noErrorsDescription,
                               onChange,
                               value = "",
                           }) => {
    const [editorInstance, setEditorInstance] = useState(null);
    const [haveValue, setHaveValue] = useState(false);

    const onEditorDataChange = useCallback(async (data) => {
        const value = JSON.stringify(data);

        onChange({target: {name, value}})
    }, [editorInstance]);

    useEffect(() => {
        let isMounted = true;

        if (!editorInstance || !value || haveValue) {
            return;
        }

        if (value && isMounted) {
            setHaveValue(true);
        }

        const renderValue = async () => {
            if (!isMounted) {
                return;
            }

            await editorInstance.isReady;
            editorInstance.render(JSON.parse(value));
        };

        renderValue();

        return () => {
            isMounted = false;
        }
    }, [value, editorInstance]);

    return (
        <div>
            <WysiwigLabel name={name} label={label} labelIcon={labelIcon} />
            <Editor data={JSON.parse(value)} instanceRef={setEditorInstance} onChange={onEditorDataChange}/>
            <WysiwigDescription inputDescription={inputDescription} />
            <WysiwigErrors name={name} errors={errors} noErrorsDescription={noErrorsDescription} />
            <Spacer />
        </div>
    );
};

WysiwygWithErrors.defaultProps = {
    errors: [],
    label: "",
    noErrorsDescription: false,
};

WysiwygWithErrors.propTypes = {
    errors: PropTypes.array,
    inputDescription: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.shape({
            id: PropTypes.string,
            params: PropTypes.object,
        }),
    ]),
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.shape({
            id: PropTypes.string,
            params: PropTypes.object,
        }),
    ]),
    labelIcon: PropTypes.shape({
        icon: PropTypes.any,
        title: PropTypes.string,
    }),
    name: PropTypes.string.isRequired,
    noErrorsDescription: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default WysiwygWithErrors;
