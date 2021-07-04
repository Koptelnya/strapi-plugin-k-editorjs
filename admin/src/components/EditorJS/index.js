import React, {useState, useRef, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import ImageTool from "@editorjs/image";

import axios from "axios";
import MediaLibAdapter from "./MediaLib/Adapter";
import MediaLibComponent from "./MediaLib/Component";
import {changeFunc, getToggleFunc} from "./MediaLib/Utils";

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

    const [mediaLibBlockIndex, setMediaLibBlockIndex] = useState(-1);

    const [isMediaLibOpen, setIsMediaLibOpen] = useState(false);

    const mediaLibToggleFunc = useCallback(getToggleFunc({
        openStateSetter: setIsMediaLibOpen,
        indexStateSetter: setMediaLibBlockIndex
    }), []);

    const handleMediaLibChange = useCallback((data) => {
        console.dir(data);

        changeFunc({
            indexStateSetter: setMediaLibBlockIndex,
            data,
            index: mediaLibBlockIndex,
            editor: editorInstance.current
        });
    }, [mediaLibBlockIndex, editorInstance]);

    const tools = useRef({
        paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            placeholder: "Начинайте писать..."
        },
        header: {
            class: Header,
            levels: [1, 2, 3, 4],
            defaultLevel: 2,
        },
        quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
                quotePlaceholder: "Цитата",
                captionPlaceholder: "Автор цитаты",
            },
        },
        delimiter: Delimiter,
        list: {
            class: NestedList,
            inlineToolbar: true,
        },
        checklist: {
            class: Checklist,
            inlineToolbar: true,
        },
        embed: Embed,
        table: Table,
        code: CodeTool,
        image: {
            class: ImageTool,
            config: {
                field: "files.image",
                additionalRequestData: {
                    data: JSON.stringify({})
                },
                additionalRequestHeaders: {
                    "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("jwtToken"))}`
                },
                endpoints: {
                    byUrl: "/editorjs/image/byUrl",
                },
                uploader: {
                    async uploadByFile(file) {
                        const formData = new FormData();
                        formData.append("data", JSON.stringify({}));
                        formData.append("files.image", file);

                        const {data} = await axios.post("/editorjs/image/byFile", formData, {
                            headers: {
                                "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("jwtToken"))}`
                            }
                        });

                        return data;
                    },
                }
            }
        },
        mediaLib: {
            class: MediaLibAdapter,
            config: {
                mediaLibToggleFunc
            }
        }
    });

    const changeHandler = useCallback(async () => {
        if (!editorInstance || !onChange) {
            return;
        }

        await editorInstance.current.isReady;

        const data = await editorInstance.current.save();
        onChange(data);
    }, [editorInstance, onChange]);

    const initEditor = useCallback(async () => {
        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                ...editorConfig,
                holder: holderId,
                data,
                ...(
                    onReady && {onReady}
                ),
                onChange: changeHandler,
                tools: tools.current,
                defaultBlock: "paragraph"
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
        };
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
        {children || <div id={holder} />} <MediaLibComponent toggle={mediaLibToggleFunc} isOpen={isMediaLibOpen}
                                                             onChange={handleMediaLibChange}
    />
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
