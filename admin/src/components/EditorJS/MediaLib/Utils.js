export const getToggleFunc = ({openStateSetter, indexStateSetter}) => {
    return (idx) => {
        if (idx || idx === 0) {
            indexStateSetter(idx);
        }

        openStateSetter((prev) => !prev);
    };
};

export const changeFunc = ({indexStateSetter, editor, data, index}) => {
    let insertedBlocksCount = 0;
    data.forEach((entry) => {
        if (!entry.mime.includes("image")) {
            return;
        }

        const newBlockType = "image";
        const newBlockData = {
            file: {
                ...entry,
                url: entry.url.replace(window.location.origin, "")
            },
            caption: "",
            withBorder: false,
            withBackground: false,
            stretched: false
        };

        editor.blocks.insert(newBlockType, newBlockData, {}, index + insertedBlocksCount, true);
        insertedBlocksCount++;
    });

    editor.blocks.delete(index + insertedBlocksCount);
    indexStateSetter(-1);
};
