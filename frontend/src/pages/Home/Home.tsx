import React, { FC } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./Home.scss";
import { ProjectCard } from "src/components";
import imageProject1 from "./../../assets/img/project-images/image-project-1.jpg";
import imageProject2 from "./../../assets/img/project-images/image-project-2.jpg";

const b = cn("home-page");

export const HomePage: FC<Props> = (props) => {
  const { className } = props;

  return (
    <div className={classNames(b(), className, "site-container")}>
      <h2 className={classNames(b("title"))}>My Last Projects</h2>

      <div className={classNames(b("projects"))}>
        <ProjectCard
          img={imageProject1}
          title="BookRiver"
          desc="Книжный интернет-магазин. Проект на Next.js."
          url="https://bookriver.ru/"
        />

        <ProjectCard
          img={imageProject2}
          title="Buro"
          desc="Сайт регистрации бизнеса. Система подачи заявки на регистрацию ИП и ООО для Федеральной налоговой службы"
          url="https://buro.app"
        />

        <ProjectCard
          img={imageProject1}
          title="VK Чекбэк"
          desc="Мини-приложение в ВК с посещаемостью 1 млн пользователей в сутки."
          url="vk.com/coupon"
        />

        <ProjectCard img={imageProject1} title="ВК Чеклист" desc="TODO-приложение от ВК." url="vk.com/checklist" />
      </div>
    </div>
  );
};
