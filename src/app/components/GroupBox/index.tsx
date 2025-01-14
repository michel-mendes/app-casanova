import React from 'react'

import style from "./index.module.css"

interface GroupBoxProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
    title?: string;
    children?: React.ReactNode;
}

function GroupBox({ title, children, ...filedsetProps }: GroupBoxProps) {
    return (
        <fieldset className={style.groupBox} style={filedsetProps.style}>

            {/* Se informado o título, renderizar componente Legend */}
            {
                (title) && <legend>{title}</legend>
            }

            {/* Renderiza os componentes inseridos no groupbox */}
            {children}

        </fieldset>
    )
}

export { GroupBox };