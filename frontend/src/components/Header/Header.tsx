import React, { FC } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./Header.scss";
import { Link, NavLink } from "react-router-dom";

const b = cn("site-header");

export const Header: FC<Props> = (props) => {
  const { className } = props;

  return (
    <header className={classNames(b(), className)}>
      <div className={classNames(b("inner"), "site-container")}>
        <nav className={classNames(b("nav"))}>
          <ul className={classNames(b("nav-list"))}>
            <li>
              <NavLink
                style={(active) =>
                  active.isActive ? { borderBottom: `5px solid tomato` } : { borderBottom: `5px solid transparent` }
                }
                className={classNames(b("nav-link"))}
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                style={(active) =>
                  active.isActive ? { borderBottom: `5px solid tomato` } : { borderBottom: `5px solid transparent` }
                }
                className={classNames(b("nav-link"))}
                to="/history"
              >
                History
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
