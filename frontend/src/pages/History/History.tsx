import React, { FC, useEffect } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./History.scss";
import { Tag } from "src/components";
import { observer } from "mobx-react-lite";
import { fetchEvents } from "src/mobx/history/services/fetchEvents";
import { HistoryModule } from "src/mobx/history";
import {Event} from "src/types/Event";

const b = cn("history-page");

export const HistoryPage: FC<Props> = observer((props) => {
  const { className } = props;

  // {
  //   '28-03-2022': {
  //     'appoitment': [],
  //     'observtaion': [],
  //     'condition': [],
  //   },
  //   '29-03-2022': {
  //     'appoitment': [],
  //     'observtaion': [],
  //     'condition': [],
  //   },
  // }

  // итоговый массив со всеми id в том порядке, в котором их нужно запрашивать с бека

  // генерируем объект с итоговой структурой
    // идем по всем events
      // берем дату данного event без времени

      // если в итоговом объекте нет ключа с данной датой
        // создаем данный ключ

      // если по данной дате уже есть массив с ключом resource
        // пушим в этот массив данный event
      // иначе
        // создаем массив с данным event

  // преобразовываем этот объект в массив id, которые будем запрашивать по 15 штук из resources
    // берем ключи итогового объекта как массив и сортируем их по дате
    // идем по объектам, которые принадлежат отсортированым датам
      // идем по ключам данного обьекта
        // пушим в итоговый массив id



  useEffect(() => {
    const getData = async () => {
      const events: Event[] = await fetchEvents();
      HistoryModule.setEvents(events)
    }
    getData()
  }, []);

  return (
    <div className={classNames(b(), className, "site-container")}>

      <table className={classNames(b("table"), className)}>
        <thead>
          <tr>
            <th>Event type</th>
            <th>Details</th>
            <th>Code</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Tag text="Appointment" color="light-green" />
            </td>
            <td>
              <p>At home exam</p>
            </td>
            <td></td>
            <td>
              <p>Mar 28, 2022</p>
            </td>
          </tr>
          <tr>
            <td>
              <Tag text="Appointment" color="blue" />
            </td>
            <td>
              <p>At home exam</p>
              <p>At home exam2</p>
              <p>At home exam3</p>
            </td>
            <td></td>
            <td>
              <p>Mar 28, 2022</p>
              <p className="disabled">Mar 28, 2022</p>
              <p className="disabled">Mar 28, 2022</p>
            </td>
          </tr>
          <tr>
            <td>
              <Tag text="Appointment" color="peach" />
            </td>
            <td>
              <p>At home exam t home exam t home exam t home exam t home exam t home exam t home exam</p>
            </td>
            <td>228073543B</td>
            <td>Mar 28, 2022</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});
