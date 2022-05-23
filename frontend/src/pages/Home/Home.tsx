import React, { FC } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./Home.scss";

const b = cn("home-page");

export const HomePage: FC<Props> = (props) => {
  const { className } = props;

  return <div className={classNames(b(), className)}>Home</div>;
};
