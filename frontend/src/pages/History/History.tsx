import React, { FC } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./History.scss";

const b = cn("history-page");

export const HistoryPage: FC<Props> = (props) => {
  const { className } = props;

  return <div className={classNames(b(), className)}>History</div>;
};
