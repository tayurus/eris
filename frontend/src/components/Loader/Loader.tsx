import React, { FC } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./Loader.scss";

const b = cn("site-loader");

export const Loader: FC<Props> = (props) => {
  const { className } = props;

  return (
    <div className={classNames(b(), className)}>
      <div className={b("inner")} />
    </div>
  );
};
