import React, { FC } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./Header.scss";
import { Link } from "react-router-dom";

const b = cn("site-header");

export const Header: FC<Props> = (props) => {
  const { className } = props;

  return (
    <header className={classNames(b(), className)}>
      <div className={classNames(b("inner"), "site-container")}>
        <nav className={classNames(b("nav"))}>
          <ul className={classNames(b("nav-list"))}>
            <li>
              <Link className={classNames(b("nav-link"))} to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className={classNames(b("nav-link"))} to="/history">
                History
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
