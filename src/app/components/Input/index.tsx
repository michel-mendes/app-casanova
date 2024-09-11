import React, { HTMLInputTypeAttribute, RefObject } from 'react'

import calendarIcon from "../../images/month-calendar-svgrepo-com.svg"
import textIcon from "../../images/text-size-svgrepo-com.svg"
import style from "./index.module.css"

interface IInputProps {
    inputType: HTMLInputTypeAttribute;
    label?: string;
    placeholder?: {
        text: string,
        insideInput: boolean
    };
    fieldName: string;
    value?: string | number;
    autocomplete?: boolean;
    widthInPixels?: number;
    refObject?: RefObject<HTMLInputElement>;
    onChange?: (value: string | number) => void,
    onPressReturnKey?: () => void,
}

function Input({ label, inputType, value, fieldName, placeholder, onChange, onPressReturnKey }: IInputProps) {

    const labelFor = fieldName
    const iconType: { src: string } = inputType == 'date'
        ? calendarIcon
        : inputType == "text"
            ? textIcon
            : ""

    return (
        <div className={style.form_group}>
            {
                label && <label htmlFor={labelFor} className={style.label}>{label}</label>
            }

            <div className={style.input_group}>
                <div className={style.icon_container}>
                    <img className={style.icon} src={iconType.src} alt="" />
                </div>

                <input
                    className={style.input}
                    name={labelFor}
                    type={inputType}
                    value={value}
                    id={labelFor}
                    placeholder={
                        (placeholder && placeholder.insideInput) ? placeholder.text : undefined
                    }
                    onChange={
                        (!onChange) ? undefined : (event) => {
                            onChange(event.target.value)
                        }}
                    onKeyDown={(e) => {
                        if (e.code == "13" || e.keyCode == 13 || e.key == "13") {
                            if (onPressReturnKey) { onPressReturnKey() }
                        }
                    }}
                />
            </div>

            {
                (placeholder && !placeholder.insideInput) && <small>{placeholder.text}</small>
            }
        </div>
    )
}

export { Input }