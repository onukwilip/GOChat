import React from "react";
import css from "./Form.module.css";

export const Form = (props) => {
  const onSubmit = (e) => {
    e.preventDefault();
    props.onSubmit();
  };

  return (
    <div className={css["form-container"]}>
      <form className={css.form} onSubmit={onSubmit}>
        {props.children}
      </form>
    </div>
  );
};

export const FormGroup = (props) => {
  return (
    <label className={css["form-group"]}>
      <div className={css["form-icon"]}>
        <i
          className={props.icon}
          aria-hidden="true"
          onClick={() => {
            props.onClick();
          }}
        ></i>
      </div>
      <div className={css["form-tag"]}>
        <input
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          required={props.required}
        />
      </div>
    </label>
  );
};
