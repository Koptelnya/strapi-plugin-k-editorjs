import PropTypes from "prop-types";
import React from "react";
import {isEmpty} from "lodash";
import {InputDescription} from "strapi-helper-plugin";

const WysiwigDescription = ({inputDescription}) => {
    const descriptionStyle = !isEmpty(inputDescription) ? {marginTop: "1.4rem"} : {};

    return <InputDescription message={inputDescription} style={descriptionStyle} />;
};

WysiwigDescription.propTypes = {
    inputDescription: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.shape({
            id: PropTypes.string,
            params: PropTypes.object,
        }),
    ]),
};

export default WysiwigDescription;
