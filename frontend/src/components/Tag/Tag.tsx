import React, { FC } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./Tag.scss";

const b = cn("tag");

export const Tag: FC<Props> = (props) => {
  const { className, color, text } = props;

  return <div className={classNames(b({ color }), className)}>{text}</div>;
};
