import React, { FC } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./ProjectCard.scss";

const b = cn("project-card");

export const ProjectCard: FC<Props> = (props) => {
  const { className, img, title, desc, url } = props;

  return (
    <div className={classNames(b(), className)}>
      <div className={classNames(b("image"))}>
        <img src={img} alt="" />
      </div>
      <h3 className={classNames(b("title"))}>{title}</h3>
      <p className={classNames(b("desc"))}>{desc}</p>
      <a className={classNames(b("link"))} href={url}>
        {url}
      </a>
    </div>
  );
};
