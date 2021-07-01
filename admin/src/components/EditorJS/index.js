import React, {useState, useRef, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import EditorJS from "@editorjs/editorjs";

const Wrapper = styled.div`
  > * {
    padding-top: 20px;
    border: 1px solid rgb(227, 233, 243);
    border-radius: 2px;
  }

  .editorjs__main {
    min-height: 200px;

    > div {
      min-height: 200px;
    }
  }
`;

const getHolderID = () => {
    const randomNumber = Math.floor(Math.random() * 1000) + Date.now().toString(36);

    return `editor-js-${randomNumber}`;
};

const Editor = ({
                    children,
                    enableReInitialize,
                    holder: customHolder,
                    onChange,
                    onReady,
                    instanceRef,
                    editorConfig,
                    data
                }) => {

    const [holder] = useState(getHolderID());
    const holderId = customHolder || holder;

    const editorInstance = useRef(null);

    const changeHandler = async () => {
        if (!editorInstance || !onChange) {
            return;
        }

        await editorInstance.current.isReady;

        const data = await editorInstance.current.save();
        onChange(data);
    };

    const initEditor = useCallback(async () => {
        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                ...editorConfig,
                holder: holderId,
                data,
                ...(
                    onReady && {onReady}
                ),
                onChange: changeHandler
            });
        }

        if (!instanceRef) {
            return;
        }

        await editorInstance.current.isReady;
        instanceRef(editorInstance.current);
    }, [editorInstance, holderId, data, editorConfig]);

    const destroyEditor = useCallback(async () => {
        if (!editorInstance.current) {
            return;
        }

        await editorInstance.current.isReady;
        editorInstance.current.destroy();
        editorInstance.current = null;
    }, [editorInstance]);

    // init on mount and destroy on unmount
    useEffect(() => {
        initEditor();

        return () => {
            destroyEditor();
        }
    }, []);

    useEffect(() => {
        if (!enableReInitialize) {
            return;
        }

        const doEffect = async () => {
            try {
                await destroyEditor();
                await initEditor();
            } catch (e) {
                // Silence is gold
            }
        };

        doEffect();
    }, [destroyEditor, initEditor, editorInstance, enableReInitialize]);

    return <Wrapper>
        {children || <div id={holder} />}
    </Wrapper>;
};

Editor.defaultProps = {
    enableReInitialize: false,
    editorConfig: {},
    data: {},
};

Editor.propTypes = {
    enableReInitialize: PropTypes.boolean,
    instanceRef: PropTypes.func,
    holder: PropTypes.string,
    onChange: PropTypes.func,
    onReady: PropTypes.func,
    editorConfig: PropTypes.object,
    data: PropTypes.object
};

export default Editor;
