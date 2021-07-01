import PropTypes from "prop-types";
import React, {Fragment} from "react";
import {isFunction, isObject} from "lodash";
import {FormattedMessage} from "react-intl";
import {Label, LabelIconWrapper} from "strapi-helper-plugin";

const WysiwigLabel = ({label, labelIcon, name}) => {
    const getLabel = () => {
        if (isObject(label) && label.id) {
            return (
                <FormattedMessage
                    id={label.id}
                    defaultMessage={label.id}
                    values={label.params}
                />
            );
        }

        if (isFunction(label)) {
            return label();
        }

        return label;
    };

    const getMessage = () => {
        const formattedLabel = getLabel();

        if (!labelIcon) {
            return formattedLabel;
        }

        return (
            <Fragment>
                {formattedLabel}
                <LabelIconWrapper title={labelIcon.title}>{labelIcon.icon}</LabelIconWrapper>
            </Fragment>
        )
    };

    return <Label htmlFor={name} message={getMessage} style={{marginBottom: 10}} />;
};

WysiwigLabel.defaultProps = {
    label: "",
};

WysiwigLabel.propTypes = {
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
};

export default WysiwigLabel;
