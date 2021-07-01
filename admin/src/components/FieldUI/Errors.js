import PropTypes from "prop-types";
import React from "react";
import {InputErrors} from "strapi-helper-plugin";

const WysiwigErrors = ({noErrorsDescription, errors, name}) => {
    const formattedErrors = (!noErrorsDescription && errors) || [];

    return <InputErrors errors={formattedErrors} name={name} />;
};

WysiwigErrors.defaultProps = {
    errors: [],
    noErrorsDescription: false,
};

WysiwigErrors.propTypes = {
    errors: PropTypes.array,
    name: PropTypes.string.isRequired,
    noErrorsDescription: PropTypes.bool,
};

export default WysiwigErrors;
