import React, { FC } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./Home.scss";
import { ProjectCard } from "src/components";
import imageProject1 from "./../../assets/img/project-images/image-project-1.jpg";
import imageProject2 from "./../../assets/img/project-images/image-project-2.jpg";
import imageProject3 from "./../../assets/img/project-images/image-project-3.jpg";
import imageProject4 from "./../../assets/img/project-images/image-project-4.jpg";

const b = cn("home-page");

export const HomePage: FC<Props> = (props) => {
  const { className } = props;

  const data = [
    {
      img: imageProject1,
      title: "BookRiver",
      desc: "Online bookstore. Project using Next.js.",
      url: "https://bookriver.ru/",
    },
    {
      img: imageProject2,
      title: "Buro",
      desc: "The system for filing an application for registration of IP and LLC for the Federal Tax Service.",
      url: "https://buro.app",
    },
    {
      img: imageProject3,
      title: "Vk CheckBack",
      desc: "VK application with attendance of 1 million users per day",
      url: "https://vk.com/coupon",
    },
    {
      img: imageProject4,
      title: "Vk CheckList",
      desc: "VK TODO-application.",
      url: "https://vk.com/checklist",
    },
  ];

  return (
    <div className={classNames(b(), className, "site-container")}>
      <h2 className={classNames(b("title"))}>My Last Projects</h2>

      <div className={classNames(b("projects"))}>
        {data.map((it) => (
          <ProjectCard {...it} />
        ))}
      </div>
    </div>
  );
};
